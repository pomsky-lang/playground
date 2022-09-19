/*
# BACKSLASH_ESC
let dig = [ascii_digit];
let xdig = [ascii_xdigit];

let esc_hex = 'x' xdig{2};
let esc_octal = '0' ['0'-'7']{2};
let esc_octal_braced = 'o{' ['0'-'7']{1,8} '}';
let esc_unicode = 'u' xdig{4};
let esc_unicode_braced = ['ux'] '{' xdig{1,6} '}';
let esc_control = 'c' [ascii_alpha];

let backref_delim = [ascii_alnum '_-+']+;
let backref_gk = ['gk'] ( '-'? dig dig?
                        | '{' backref_delim '}'
                        | '<' backref_delim '>'
                        | "'" backref_delim "'"
                        );

let category = ['pP'] ( [ascii_alpha]
                      | '{' '^'? [ascii_alnum '_-+']+ '}'
                      );

Start '\' ( esc_hex
          | esc_octal
          | esc_octal_braced
          | esc_unicode
          | esc_unicode_braced
          | esc_control
          | backref_gk
          | category
          | C
          )
*/
const BACKSLASH_ESC =
  /^\\(?:x[0-9a-fA-F]{2}|0[0-7]{2}|o\{[0-7]{1,8}\}|u[0-9a-fA-F]{4}|[ux]\{[0-9a-fA-F]{1,6}\}|c[a-zA-Z]|[gk](?:-?[0-9][0-9]?|\{[0-9a-zA-Z_\-+]+\}|<[0-9a-zA-Z_\-+]+>|'[0-9a-zA-Z_\-+]+')|[pP](?:[a-zA-Z]|\{\^?[0-9a-zA-Z_\-+]+\})|[\s\S])/u

/*
# MODIFIER
let name = [ascii_alnum '+-_']+;

let group_content = ('&' | 'P=' | 'P>') name
                  | ['R0']
                  | ['+-']? [ascii_digit]+;

Start '?' ( ['|>']
          | '<'? ['=!']
          | 'P'? '<' name '>'
          | "'" name "'"
          | '(' name ')'
          | '(<' name '>)'
          | "('" name "')"
          | group_content (>> ')')
          )?
*/
const MODIFIER =
  /^\?(?:[|>]|<?[=!]|P?<[0-9a-zA-Z+\-_]+>|'[0-9a-zA-Z+\-_]+'|\([0-9a-zA-Z+\-_]+\)|\(<[0-9a-zA-Z+\-_]+>\)|\('[0-9a-zA-Z+\-_]+'\)|(?:(?:&|P=|P>)[0-9a-zA-Z+\-_]+|[R0]|[+-]?[0-9]+)(?=\)))?/u

/*
['\[](){}^$.|?*+-&']
*/
const NO_PLAINTEXT = /[\\[\](){}^$.|?*+\-&]/u

export type Token =
  | 'string'
  | 'punct'
  | 'modifier'
  | 'caret'
  | 'dollar'
  | 'star'
  | 'plus'
  | 'questionmark'
  | 'brace'
  | 'dash'
  | 'dot'
  | 'escape'

const enum Context {
  Global = 0,
  ParenStart = 1,
  CharClassStart = 2,
  CharClass = 3,
  Braces = 4,
}

export function tokenizeRegex(input: string): [Token, number, number][] {
  const result: [Token, number, number][] = []
  let offset = 0
  let context = Context.Global

  for (;;) {
    if (input.length === 0) {
      break
    }

    const [len, token, nextContext] = consumeChain(input, context)
    context = nextContext

    if (len === 0) {
      throw new Error('len is 0\n  at ' + input)
    }

    const start = offset
    offset += len
    input = input.slice(len)
    result.push([token, start, offset])
  }

  return result
}

const globalTokens: { [token: string]: Token } = {
  '$': 'dollar',
  '^': 'caret',
  '*': 'star',
  '+': 'plus',
  '?': 'questionmark',
  ')': 'punct',
  '.': 'dot',
  '|': 'punct',
}

// eslint-disable-next-line complexity
function consumeChain(input: string, context: Context): [number, Token, Context] {
  if (context === Context.Braces) {
    const braceIdx = input.indexOf('}')
    if (braceIdx === -1) {
      return [input.length, 'punct', Context.Braces]
    } else if (braceIdx === 0) {
      return [1, 'brace', Context.Global]
    } else {
      return [braceIdx, 'punct', Context.Braces]
    }
  }

  const char = input.slice(0, 1)

  if (context === Context.CharClassStart && char === '^') {
    return [1, 'modifier', Context.CharClass]
  }

  if (context === Context.ParenStart) {
    if (input.startsWith('?:')) {
      return [2, 'punct', Context.Global]
    }

    MODIFIER.lastIndex = 0
    const result = MODIFIER.exec(input)
    if (result != null) {
      return [result[0].length, 'modifier', Context.Global]
    }

    context = Context.Global
  }

  if (context === Context.Global) {
    if (char in globalTokens) {
      return [1, globalTokens[char], Context.Global]
    } else if (char === '(') {
      return [1, 'punct', Context.ParenStart]
    } else if (char === '[') {
      return [1, 'punct', Context.CharClassStart]
    } else if (char === '{') {
      return [1, 'brace', Context.Braces]
    }
  } else if (context === Context.CharClass || context === Context.CharClassStart) {
    if (char === '-' && context !== Context.CharClassStart && input.charAt(1) !== ']') {
      return [1, 'punct', Context.CharClass]
    } else if (char === ']') {
      return [1, 'punct', Context.Global]
    }
    // TODO: [[:ascii:]], [hello&&world], [hello-[world]], [hello--[world]]
  }

  BACKSLASH_ESC.lastIndex = 0
  const result = BACKSLASH_ESC.exec(input)
  if (result != null) {
    return [
      result[0].length,
      'escape',
      context === Context.CharClass || context === Context.CharClassStart
        ? Context.CharClass
        : Context.Global,
    ]
  }

  NO_PLAINTEXT.lastIndex = 1
  const noPlain = input.search(NO_PLAINTEXT)

  return [
    noPlain <= 0 ? 1 : noPlain,
    'string',
    context === Context.CharClassStart ? Context.CharClass : context,
  ]
}
