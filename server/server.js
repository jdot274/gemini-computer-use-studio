import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pty from 'node-pty';
import os from 'os';
import { GeminiAgent } from './gemini-agent.js';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
const sessions = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 120,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });
  
  const agent = new GeminiAgent(process.env.GOOGLE_API_KEY);
  
  sessions.set(socket.id, {
    pty: ptyProcess,
    agent,
    outputBuffer: [],
    lastLintStatus: null
  });
  
  ptyProcess.onData((data) => {
    const session = sessions.get(socket.id);
    session.outputBuffer.push(data);
    if (session.outputBuffer.length > 100) session.outputBuffer.shift();
    socket.emit('terminal.output', data);
  });
  
  socket.on('terminal.input', (data) => ptyProcess.write(data));
  socket.on('terminal.resize', ({ cols, rows }) => ptyProcess.resize(cols, rows));
  
  socket.on('gemini.command', async (data) => {
    const session = sessions.get(socket.id);
    const { command, mode } = data;
    socket.emit('gemini.status', { status: 'thinking' });
    
    try {
      const context = {
        terminalOutput: session.outputBuffer.join(''),
        lastLintStatus: session.lastLintStatus
      };
      
      const result = await agent.executeCommand(command, context, {
        autoRun: mode.autoRun,
        onAction: (action) => {
          socket.emit('gemini.action', action);
          if (action.type === 'shell' && mode.autoRun) {
            ptyProcess.write(action.command + '\r');
          }
        },
        onBrowserAction: (browserAction) => socket.emit('gemini.browser', browserAction)
      });
      
      socket.emit('gemini.result', result);
      socket.emit('gemini.status', { status: 'complete' });
    } catch (error) {
      socket.emit('gemini.error', { message: error.message });
    }
  });
  
  socket.on('gemini.monitor', async ({ enabled }) => {
    const session = sessions.get(socket.id);
    if (enabled) {
      session.monitorInterval = setInterval(async () => {
        const recentOutput = session.outputBuffer.slice(-20).join('');
        if (recentOutput.match(/error|failed/i)) {
          const result = await agent.analyzeAndFix(recentOutput);
          socket.emit('gemini.auto-action', result);
          result.commands?.forEach(cmd => ptyProcess.write(cmd + '\r'));
        }
      }, 2000);
    } else {
      clearInterval(session.monitorInterval);
    }
  });
  
  socket.on('disconnect', () => {
    const session = sessions.get(socket.id);
    if (session) {
      session.pty.kill();
      clearInterval(session.monitorInterval);
      sessions.delete(socket.id);
    }
  });
});

server.listen(8080, () => console.log('🚀 Server running on http://localhost:8080'));
