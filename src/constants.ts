export const COM_OPEN_REPO = 'saber2pr.open.repo'
export const COM_OPEN_TERMINAL = 'saber2pr.open.terminal'
export const COM_CHANGE_THEME = 'saber2pr.change.theme'
export const COM_CHANGE_LOCALE = 'saber2pr.change.locale'
export const COM_RELOAD = 'saber2pr.reload'
export const COM_OPEN_VSC_MARKETPLACE = 'saber2pr.open.vsc-marketplace'
export const COM_OPEN_EXTLIST_CONFIG = 'saber2pr.open.extlist.config'
export const COM_OPEN_FILE_WINDOW = 'saber2pr.open.file.window'
export const COM_OPEN_IFrame = 'saber2pr.open.iframe'
export const COM_GIT_PUSH_CHORE = 'saber2pr.git.push.chore'
export const COM_GIT_PULL = 'saber2pr.git.pull'
export const COM_LOG_LINE = 'saber2pr.log.line'

// open url
export const COM_OPEN_URL_BLOG = 'saber2pr.open.url.saber2pr-blog'

// src
export const listUri =
  'https://saber2pr.top/static/data/vsc-saber2pr-extensions.json'
export const refreshExtensionUri =
  'https://purge.jsdelivr.net/gh/Saber2pr/saber2pr.github.io@master/static/data/vsc-saber2pr-extensions.json'

// config
export const Plugins = [
  {
    'zh-cn': '博客笔记',
    en: 'My Blog',
    href: 'https://saber2pr.top/?plain-menu-blog#/blog/%E6%B0%B8%E6%81%92%E3%81%AE%E5%B9%BB%E6%83%B3%E4%B9%A1',
  },
  {
    'zh-cn': '脚本管理',
    en: 'Script Manage',
    command: 'vsc-scripts-manager.main',
  },
  {
    'zh-cn': 'Todo管理',
    en: 'Todo Manage',
    command: 'todolist.main',
  },
  {
    'zh-cn': 'JSON转DTs',
    en: 'JSON To DTs',
    href: 'https://saber2pr.top/json-type-app/',
  },
  {
    'zh-cn': 'Leetcode',
    en: 'Leetcode',
    href: 'https://labuladong.github.io/algo/',
  },
]
