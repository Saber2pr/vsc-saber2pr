import { spawn } from 'child_process';

import { getRootPath } from './editor';

export const execShell = (command: string, args: string[]) =>
  new Promise<string>((resolve, reject) => {
    const ls = spawn(command, args, {
      cwd: getRootPath()?.fsPath,
    })
    let result = ''
    let error = ''
    ls.stdout.on('data', data => {
      result += data
    })

    ls.stderr.on('data', data => {
      error += data
    })

    ls.on('close', () => {
      if (result) {
        resolve(result)
      }
      if (error) {
        reject(error)
      }
    })
  })
