import { languages } from 'monaco-editor'

export const languageDefinition: languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [
        /\b(let|enable|disable|lazy|greedy|range|base|atomic|if|else|recursion|regex)\b/u,
        'keyword',
      ],
      [/[$^%!*+?<>{}|\-.]+/u, 'keyword'],
      [/::?\w*/u, 'keyword'],
      [/\d+/u, 'constant.numeric.decimal'],
      [/U\+?[0-9a-fA-F_]{1,6}/u, 'type'],
      [/\b[a-zA-Z_]\w*\b/u, 'variable'],
      [/"/u, 'string', '@stringDoublePomsky'],
      [/'/u, 'string', '@stringSinglePomsky'],
      [/#.*/u, 'comment'],
    ],
    stringDoublePomsky: [
      [/[^\\"]+/u, 'string'],
      [/\\["\\]/u, 'string.escape'],
      [/\\/u, 'string.invalid'],
      [/"/u, 'string', '@pop'],
    ],
    stringSinglePomsky: [
      [/[^']+/u, 'string'],
      [/'/u, 'string', '@pop'],
    ],
  },
}
