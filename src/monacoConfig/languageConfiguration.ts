import { languages } from 'monaco-editor'

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
      beforeText: /^\s*#/u,
    },
    {
      action: {
        indentAction: languages.IndentAction.IndentOutdent,
      },
      beforeText: /\(\s*!?(<<|>>)?\s*$/u,
      afterText: /\)/u,
    },
  ],
}
