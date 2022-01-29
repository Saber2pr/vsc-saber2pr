import vscode from 'vscode'

export function getUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  pathList: string[]
) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList))
}

export const appendParams = (url: string, queryStr?: string) => {
  if (url && queryStr) {
    let retUrl = ''
    const [href, hash] = url.split('#')
    if (url.indexOf('?') !== -1) {
      retUrl = `${href}&${queryStr}`
    } else {
      retUrl = `${url}?${queryStr}`
    }
    if (hash) {
      return `${retUrl}#${hash}`
    }
    return retUrl
  }
  return url
}

export const isActiveThemeKind = (kind: vscode.ColorThemeKind) =>
  vscode.window.activeColorTheme.kind === kind
