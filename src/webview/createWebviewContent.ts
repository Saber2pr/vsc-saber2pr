import * as vscode from 'vscode'
import { getUri } from './utils'

export type WebviewContentOps = {
  bodyStyle?: string
}

export const createWebviewContent = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  content: string,
  ops: WebviewContentOps = {}
) => {
  const toolkitUri = getUri(webview, extensionUri, [
    'node_modules',
    '@vscode',
    'webview-ui-toolkit',
    'dist',
    'toolkit.js',
  ])

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script type="module" src="${toolkitUri}"></script>
    <script>
      window.vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null
    </script>
  </head>
  <body style="${ops?.bodyStyle || ''}">
   ${content}
  </body>
  </html>
  `
}
