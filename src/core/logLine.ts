import { parse } from 'path'
import vscode from 'vscode'

export const logLine = () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage('No active editor')
    return
  }

  const document = editor.document
  const selection = editor.selection

  const firstNonWhitespaceCharacterIndex = document.lineAt(
    selection.start.line
  ).firstNonWhitespaceCharacterIndex

  const padStart = String(' ').repeat(firstNonWhitespaceCharacterIndex)

  // 获取选中文本
  const selectedText = document.getText(selection)

  // 获取选中行的行号
  const line = selection.active.line

  // 插入 console.log
  editor.edit(editBuilder => {
    const insertPosition = new vscode.Position(line + 1, 0)
    editBuilder.insert(
      insertPosition,
      `${padStart}console.log('🚀 ~ ${
        parse(document.fileName).name
      } ~ ${selectedText}:', ${selectedText});\n`
    )
  })
}
