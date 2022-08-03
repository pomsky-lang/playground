import { languages } from 'monaco-editor'

export const languageDefinition: languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/\b(let|enable|disable|lazy|greedy|range|base)\b/, 'keyword'],
      [/[$^%!*+?<>{}\-.]+/, 'keyword'],
      [/::?\w*/u, 'keyword'],
      [/\d+/, 'variable'],
      [/U\+[0-9a-fA-F_]{1,6}/, 'type'],
      [/\b[a-zA-Z_]\w*\b/, 'function'],
      [/"(\\[\s\S]|[^"])*"/, 'string'],
      [/'[^']*'/, 'string'],
      [/#.*/, 'comment'],
    ],
  },
}

export const languageConfiguration: languages.LanguageConfiguration = {
  autoClosingPairs: [
    { open: '[', close: ']' },
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
}
