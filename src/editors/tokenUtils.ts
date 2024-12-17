import { Token } from '@pomsky-lang/parser'

export function findClosestTokenIndex(tokens: [Token, number, number][], offset: number): number {
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
  [Token.Not]: true,
  [Token.Dash]: true,
  [Token.Dot]: true,
  [Token.String]: true,
  [Token.CodePoint]: true,
  [Token.Identifier]: true,
}

export function isInCharacterSet(
  tokens: [Token, number, number][],
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
    if (pt[0] === Token.OpenBracket) {
      return true
    } else if (!tokensAllowedInClass[pt[0]]) {
      return false
    }
  }

  return false
}
