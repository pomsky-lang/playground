import { languages } from 'monaco-editor'

export const languageDefinition: languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/\bU\s*\+\s*[0-9a-zA-Z]+\b/u, 'constant.numeric'],
      [/\b(let|enable|disable|test|U)\b/u, 'keyword.other'],
      [
        /\b(if|else|lazy|greedy|range|base|atomic|recursion|regex)\b|!?(<<|>>)|[+*?]/u,
        'keyword.control',
      ],
      [/:(:?\w*([+-]?\d+|[a-zA-Z_][a-zA-Z0-9_]*)\b)?/u, 'variable.name'],
      [/\b[0-9]+\b/u, 'constant.numeric'],
      [/[.^$%]|!%/u, 'constant.language'],
      [/[|!]/u, 'keyword.operator'],
      [/\b(Start|End|C|Codepoint|G|Grapheme)\b/u, 'constant.other'],
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
