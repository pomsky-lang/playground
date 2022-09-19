import { err } from '../utils/err'

const IS_ASCII_DIGIT = /[0-9]/u
const NO_ASCII_HEXDIGIT = /[^0-9a-fA-F]/u
const IS_LETTER = /\p{Alpha}/u
const NO_WORD_CHAR = /[^\p{Alpha}\p{M}\p{Nd}_]/u

const DOUBLE_QUOTED_STRING = /^"(?:\\[\s\S]|[^\\"])*"?/u

type Token =
  | 'Caret'
  | 'Dollar'
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

export function tokenizePomsky(input: string): [Token | TokenError, number, number][] {
  const result: [Token | TokenError, number, number][] = []
  let offset = 0

  for (;;) {
    const inputLen = input.length
    input = input.replace(/^(\s*|#.*)*/u, '')
    offset += inputLen - input.length

    if (input.length === 0) {
      break
    }

    const [len, token] = consumeChain(input)

    const start = offset
    offset += len
    input = input.slice(len)
    result.push([token, start, offset])
  }

  return result
}

const singleTokens: { [token: string]: Token | TokenError } = {
  '$': 'Dollar',
  '^': 'Caret',
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
}

// eslint-disable-next-line complexity
function consumeChain(input: string): [number, Token | TokenError] {
  const char = input[0]

  if (input.startsWith('>>')) return [2, 'LookAhead']
  if (input.startsWith('<<')) return [2, 'LookBehind']
  if (input.startsWith('::')) return [2, 'Backref']

  if (char in singleTokens) return [1, singleTokens[char]]

  if (char === "'") {
    const lenInner = input.slice(1).indexOf("'")
    if (lenInner === -1) {
      return [input.length, { error: 'UnclosedString' }]
    } else {
      return [lenInner + 2, 'String']
    }
  }

  if (char === '"') {
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

  if (IS_LETTER.test(char) || char === '_') {
    const wordLength = input.search(NO_WORD_CHAR)
    return [wordLength === -1 ? input.length : wordLength, 'Identifier']
  }

  return [1, { error: 'Unknown' }]
}

function findLengthOfDoubleQuotedString(input: string): number | undefined {
  DOUBLE_QUOTED_STRING.lastIndex = 0
  const res = DOUBLE_QUOTED_STRING.exec(input) ?? err('quote not found')
  return res[0].length
}

export function findClosestTokenIndex(
  tokens: [Token | TokenError, number, number][],
  offset: number,
): number {
  let lowerBound = 0
  let upperBound = tokens.length

  for (;;) {
    if (upperBound - lowerBound <= 1) {
      return lowerBound
    }

    const middle = (upperBound + lowerBound) >> 1
    const middleToken = tokens[middle]
    if (offset < middleToken[1]) {
      upperBound = middle
    } else if (offset > middleToken[2]) {
      lowerBound = middle
    } else if (offset === middleToken[1]) {
      // ___XXX___
      //   /\
      return middle > 0 && offset === tokens[middle - 1][2] ? middle - 1 : middle
    } else {
      // ___XXX___
      //    /##\
      return middle
    }
  }
}

const tokensAllowedInClass: Partial<Record<Token, true>> = {
  Not: true,
  Dash: true,
  Dot: true,
  String: true,
  CodePoint: true,
  Identifier: true,
}

export function isInCharacterSet(
  tokens: [Token | TokenError, number, number][],
  index: number,
  offset: number,
): boolean {
  const token = tokens[index]

  const previousTokens = tokens.slice(0, index + 1)
  if (token[1] >= offset) {
    previousTokens.pop()
  }
  for (let i = previousTokens.length - 1; i >= 0; i--) {
    const pt = previousTokens[i]
    if (pt[0] === 'OpenBracket') {
      return true
    } else if (typeof pt[0] === 'string' && !tokensAllowedInClass[pt[0]]) {
      return false
    }
  }

  return false
}
