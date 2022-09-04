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

export const languageConfiguration: languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
  },
  autoClosingPairs: [
    { open: '[\\', close: ']' },
    { open: '(', close: ')' },
    { open: '{', close: '}' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  colorizedBracketPairs: [['(', ')']],
  surroundingPairs: [
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  brackets: [
    ['(', ')'],
    ['[', ']'],
  ],
  onEnterRules: [
    {
      action: {
        indentAction: languages.IndentAction.None,
        appendText: '# ',
      },
      beforeText: /^\s*#/,
    },
    {
      action: {
        indentAction: languages.IndentAction.IndentOutdent,
      },
      beforeText: /\(\s*!?(<<|>>)?\s*$/,
      afterText: /\)/,
    },
  ],
}
