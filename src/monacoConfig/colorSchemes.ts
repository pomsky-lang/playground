import { editor } from 'monaco-editor'

export const CustomDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '69ace3' },
    { token: 'string', foreground: 'dca088' },
    { token: 'string.escape', foreground: 'ffcc77', fontStyle: 'bold' },
    { token: 'string.invalid', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'constant.numeric', foreground: 'b5cea8' },
    { token: 'variable', foreground: '9cdcfe' },
  ],
  colors: {},
}

export const CustomLightTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '0000ff' },
    { token: 'string', foreground: 'a31515' },
    { token: 'string.escape', foreground: '734141', fontStyle: 'bold' },
    { token: 'string.invalid', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'constant.numeric', foreground: '097000' },
    { token: 'variable', foreground: '000000' },
  ],
  colors: {},
}
