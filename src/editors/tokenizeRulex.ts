const IS_ASCII_DIGIT = /[0-9]/
const NO_ASCII_HEXDIGIT = /[^0-9a-fA-F]/
const IS_LETTER = /\p{Alpha}/u
const NO_WORD_CHAR = /[^\p{Alpha}\p{M}\p{Nd}_]/u

const QUOTE_OR_BS = /[\\"]/

type Token =
  | 'BStart'
  | 'BEnd'
  | 'LookAhead'
  | 'LookBehind'
  | 'Backref'
  | 'BWord'
  | 'Star'
  | 'Plus'
  | 'QuestionMark'
  | 'Pipe'
  | 'Colon'
  | 'OpenParen'
  | 'CloseParen'
  | 'OpenBrace'
  | 'CloseBrace'
  | 'Comma'
  | 'Not'
  | 'OpenBracket'
  | 'Dash'
  | 'CloseBracket'
  | 'Dot'
  | 'Semicolon'
  | 'Equals'
  | 'String'
  | 'CodePoint'
  | 'Number'
  | 'Identifier'

interface TokenError {
  error: string
}

export function tokenizeRulex(input: string): [Token | TokenError, number, number][] {
  let result: [Token | TokenError, number, number][] = []
  let offset = 0

  for (;;) {
    const inputLen = input.length
    input = input.trim()
    while (input.startsWith('#')) {
      const lineBreakIdx = input.indexOf('\n')
      if (lineBreakIdx !== -1) {
        input = input.slice(lineBreakIdx + 1).trim()
      } else {
        input = ''
      }
    }

    offset += inputLen - input.length

    if (input.length === 0) {
      break
    }

    const c = input.slice(0, 1)

    const [len, token] = consumeChain(input, c)

    const start = offset
    offset += len
    input = input.slice(len)
    result.push([token, start, offset])
  }

  return result
}

const singleTokens: { [token: string]: Token | TokenError } = {
  '%': 'BWord',
  '*': 'Star',
  '+': 'Plus',
  '?': 'QuestionMark',
  '|': 'Pipe',
  ':': 'Colon',
  '(': 'OpenParen',
  ')': 'CloseParen',
  '{': 'OpenBrace',
  '}': 'CloseBrace',
  ',': 'Comma',
  '!': 'Not',
  '[': 'OpenBracket',
  '-': 'Dash',
  ']': 'CloseBracket',
  '.': 'Dot',
  ';': 'Semicolon',
  '=': 'Equals',
  '^': { error: 'Caret' },
  $: { error: 'Dollar' },
}

function consumeChain(input: string, char: string): [number, Token | TokenError] {
  if (input.startsWith('<%')) return [2, 'BStart']
  if (input.startsWith('%>')) return [2, 'BEnd']
  if (input.startsWith('>>')) return [2, 'LookAhead']
  if (input.startsWith('<<')) return [2, 'LookBehind']
  if (input.startsWith('::')) return [2, 'Backref']

  if (char in singleTokens) return [1, singleTokens[char]]

  if (char == "'") {
    const lenInner = input.slice(1).indexOf("'")
    if (lenInner === -1) {
      return [input.length, { error: 'UnclosedString' }]
    } else {
      return [lenInner + 2, 'String']
    }
  }

  if (char == '"') {
    const len = findLengthOfDoubleQuotedString(input)
    if (len !== undefined) {
      return [len, 'String']
    } else {
      return [input.length, { error: 'UnclosedString' }]
    }
  }

  if (input.startsWith('U+')) {
    const rest = input.slice(2)
    const lenInner = rest.search(NO_ASCII_HEXDIGIT)
    if (lenInner === -1) {
      return [input.length, 'CodePoint']
    } else if (lenInner === 0) {
      return [1, { error: 'MissingCodePointNumber' }]
    } else {
      return [lenInner + 2, 'CodePoint']
    }
  }

  if (IS_ASCII_DIGIT.test(char)) {
    const numLength = input.search(NO_WORD_CHAR)
    return [numLength === -1 ? input.length : numLength, 'Number']
  }

  if (IS_LETTER.test(char) || char == '_') {
    const wordLength = input.search(NO_WORD_CHAR)
    return [wordLength === -1 ? input.length : wordLength, 'Identifier']
  }

  return [1, { error: 'Unknown' }]
}

function findLengthOfDoubleQuotedString(input: string): number | undefined {
  let index = 1

  for (;;) {
    QUOTE_OR_BS.lastIndex = index
    QUOTE_OR_BS.test(input)
    const li = QUOTE_OR_BS.lastIndex
    if (li === 0) {
      return
    }

    if (input[li - 1] === '"') {
      return li
    } else if (li <= input.length) {
      index = li
    } else {
      return
    }
  }
}
