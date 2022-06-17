import { languages } from 'monaco-editor'

export const languageDefinition: languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/\b(let|enable|disable|lazy|greedy|range|base)\b/, 'keyword'],
      [/[%!*+?<>{}\-.]+/, 'keyword'],
      [/::?\w*/u, 'keyword'],
      [/\d+/, 'variable'],
      [/"(\\[\s\S]|[^"])*"/, 'string'],
      [/'[^']*'/, 'string'],
      [/#.*/, 'comment'],
    ],
  },
}
