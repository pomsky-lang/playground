import type { editor } from 'monaco-editor'

export const CustomDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword.operator', foreground: 'd5d5d5' },
    { token: 'keyword.control', foreground: 'e294dc' },
    { token: 'keyword.other', foreground: '69ace3' },
    { token: 'string', foreground: 'dca088' },
    { token: 'string.escape', foreground: 'ffcc77', fontStyle: 'bold' },
    { token: 'string.invalid', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'constant.numeric', foreground: 'B5CEA8' },
    { token: 'constant.language', foreground: '569CD6' },
    { token: 'constant.other', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9cdcfe' },
    { token: 'variable.name', foreground: '9CDCFE' },
  ],
  colors: {
    'editor.background': '#1e2125',
  },
}

export const CustomLightTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword.operator', foreground: '000000' },
    { token: 'keyword.control', foreground: 'AF00DB' },
    { token: 'keyword.other', foreground: '0000ff' },
    { token: 'string', foreground: 'a31515' },
    { token: 'string.escape', foreground: '734141', fontStyle: 'bold' },
    { token: 'string.invalid', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'constant.numeric', foreground: '097000' },
    { token: 'constant.language', foreground: '0000FF' },
    { token: 'constant.other', foreground: '795E26' },
    { token: 'variable', foreground: '000000' },
    { token: 'variable.name', foreground: '001080' },
  ],
  colors: {},
}
