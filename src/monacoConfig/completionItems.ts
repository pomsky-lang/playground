import { Token, tokenize } from '@pomsky-lang/parser'
import { languages } from 'monaco-editor'

import { findClosestTokenIndex, isInCharacterSet } from '../editors/tokenUtils'
import { charSetSnippets, completionRange, globalSnippets } from './snippets'

export const completionItems: languages.CompletionItemProvider = {
  provideCompletionItems(model, position) {
    const value = model.getValue()
    const tokens = tokenize(value)

    const offset = model.getOffsetAt(position)
    const tokenIndex = findClosestTokenIndex(tokens, offset)
    let isInCharClass = false

    if (tokenIndex < tokens.length) {
      // don't show completions within strings or multi-char sigils such as `<<`
      const token = tokens[tokenIndex]
      if (token[0] !== Token.Identifier && offset > token[1] && offset < token[2]) return

      isInCharClass = isInCharacterSet(tokens, tokenIndex, offset)
    }

    const wordModel = model.getWordAtPosition(position)

    // This implicitly updates all snippets, which reference this object
    completionRange.startColumn = wordModel?.startColumn ?? position.column
    completionRange.endColumn = wordModel?.endColumn ?? position.column
    completionRange.startLineNumber = position.lineNumber
    completionRange.endLineNumber = position.lineNumber

    const suggestions = isInCharClass
      ? charSetSnippets
      : [
          ...[...new Set([...value.matchAll(/\blet (\w+)/giu)].map((x) => x[1]))].map(
            (word): languages.CompletionItem => ({
              kind: languages.CompletionItemKind.Variable,
              label: word,
              insertText: word,
              detail: 'variable',
              range: completionRange,
            }),
          ),
          ...globalSnippets,
        ]

    return { suggestions }
  },
}
