import { languages } from 'monaco-editor'

export const languageDefinition: languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/\b(let|enable|disable|lazy|greedy|range|base|atomic|if|else|recursion|regex)\b/, 'keyword'],
      [/[$^%!*+?<>{}|\-.]+/, 'keyword'],
      [/::?\w*/u, 'keyword'],
      [/\d+/, 'constant.numeric.decimal'],
      [/U\+?[0-9a-fA-F_]{1,6}/, 'type'],
      [/\b[a-zA-Z_]\w*\b/, 'variable'],
      [/"/, 'string', '@stringDoublePomsky'],
      [/'/, 'string', '@stringSinglePomsky'],
      [/#.*/, 'comment'],
    ],
    stringDoublePomsky: [
      [/[^\\"]+/, 'string'],
      [/\\["\\]/, 'string.escape'],
      [/\\/, 'string.invalid'],
      [/"/, 'string', '@pop'],
    ],
    stringSinglePomsky: [
      [/[^']+/, 'string'],
      [/'/, 'string', '@pop'],
    ],
  },
}
