import { spawn } from 'child_process'

import { getRootPath } from './editor'

export const execShell = (command: string, args: string[]) =>
  new Promise<string>(resolve => {
    const task = spawn(command, args, {
      cwd: getRootPath()?.fsPath,
      env: process.env,
      shell: true,
      stdio: 'inherit',
    })
    task.on('close', resolve)
  })
