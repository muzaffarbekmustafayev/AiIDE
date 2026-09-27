#!/usr/bin/env node


const { program } = require('commander');
const { spawn } = require('child_process');
const path = require('path');

program
  .version('1.0.0')
  .description('AI IDE CLI CLI to start the client and server');

program
  .command('start')
  .description('Starts the IDE server and client')
  .action(() => {
    console.log('Starting IDE Server...');
    const serverProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, '..', 'server'),
        stdio: 'inherit',
        shell: true
    });
    
    console.log('Starting IDE Client...');
    const clientProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(__dirname, '..', 'client'),
        stdio: 'inherit',
        shell: true
    });
  });

program.parse(process.argv);