import type {
  PomskyTestCapture,
  PomskyTestMatch,
  PomskyTestMatchAll,
  PomskyTestReject,
} from '@pomsky-lang/compiler-web'
import type { Diagnostic } from './pomskySupport'
import type { TestMessage } from './workers'

self.onmessage = ({ data }: MessageEvent<TestMessage>) => {
  try {
    const output = runTests(data)
    self.postMessage({ output })
  } catch (e) {
    self.postMessage({ error: e instanceof Error ? e.message : 'Testing failed or timed out' })
  }
}

const severityError = 8

function runTests({ input, output, tests }: TestMessage): Diagnostic[] {
  if (tests.length === 0) return []

  const globalRegex = new RegExp(output, 'gu')
  const stickyRegex = new RegExp(output, 'yu')

  const errors: Diagnostic[] = []
  for (const test of tests) {
    globalRegex.lastIndex = 0
    stickyRegex.lastIndex = 0

    if ('match' in test) {
      checkSingleMatch(input, stickyRegex, test.match, errors)
    } else if ('matchAll' in test) {
      checkMultiMatch(input, globalRegex, test.matchAll, errors)
    } else {
      checkReject(input, test.reject.asSubstring ? globalRegex : stickyRegex, test.reject, errors)
    }
  }
  return errors
}

function checkSingleMatch(
  input: string,
  regex: RegExp,
  { literal, range, captures }: PomskyTestMatch,
  errors: Diagnostic[],
) {
  const res = regex.exec(literal)
  if (res != null && res[0].length === literal.length) {
    checkCaptures(input, res, captures, errors)
  } else {
    errors.push({
      severity: severityError,
      ...convertRange(input, range),
      message: `Expression does not exactly match the string '${literal}`,
      title: 'No exact match',
      help:
        res != null
          ? `Expression matches a substring '${res[0]}', but not the entire string`
          : undefined,
      code: 'test',
    })
  }
}

function checkMultiMatch(
  input: string,
  regex: RegExp,
  { literal, matches, range }: PomskyTestMatchAll,
  errors: Diagnostic[],
) {
  const results: RegExpExecArray[] = []
  let _res: RegExpExecArray | null
  let prevLastIndex = 0

  while ((_res = regex.exec(literal)) != null) {
    results.push(_res)
    if (regex.lastIndex === prevLastIndex) {
      regex.lastIndex++
    }
    prevLastIndex = regex.lastIndex
  }

  if (matches.length === 0 && results.length > 0) {
    return
  }

  const minNumber = Math.min(matches.length, results.length)

  for (let i = 0; i < minNumber; i++) {
    const result = results[i]
    const match = matches[i]
    if (result[0] === match.literal) {
      checkCaptures(input, result, match.captures, errors)
    } else {
      errors.push({
        severity: severityError,
        ...convertRange(input, match.range),
        message: `Match #${i} is '${result[0]}', but expected '${match.literal}`,
        title: 'Incorrect match',
        code: 'test',
      })
    }
  }

  if (results.length !== matches.length) {
    errors.push({
      severity: severityError,
      ...convertRange(input, range),
      message: `There are ${results.length} matches, but ${matches.length} matches were expected`,
      title: 'Wrong number of matches',
      code: 'test',
    })
  }
}

function checkReject(
  input: string,
  regex: RegExp,
  { literal, range, asSubstring }: PomskyTestReject,
  errors: Diagnostic[],
) {
  const res = regex.exec(literal)
  if (res == null || (!asSubstring && res[0].length !== literal.length)) {
    return
  }

  errors.push({
    severity: severityError,
    ...convertRange(input, range),
    message: asSubstring
      ? `Expression matches the substring '${literal}', but was not supposed to match`
      : `Expression matches exactly, but was not supposed to match`,
    title: 'Unexpected match',
    code: 'test',
  })
}

function checkCaptures(
  input: string,
  res: RegExpExecArray,
  captures: PomskyTestCapture[],
  errors: Diagnostic[],
) {
  captures.forEach(({ ident, identRange, literal, range }) => {
    const found = typeof ident === 'number' ? res[ident] : res.groups?.[ident]
    if (found === undefined) {
      errors.push({
        severity: severityError,
        ...convertRange(input, identRange),
        message: `Match does not have capturing group '${ident}'`,
        title: 'Missing capturing group',
        code: 'test',
      })
    } else if (found !== literal) {
      errors.push({
        severity: severityError,
        ...convertRange(input, range),
        message: `Capturing group '${ident}' matched the text '${found}', but was expected to match '${literal}'`,
        title: 'Wrong capturing group content',
        code: 'test',
      })
    }
  })
}

// Copied from ./convertRange.ts
function convertRange(
  input: string,
  [start, end]: [number, number],
): { startColumn: number; startLineNumber: number; endColumn: number; endLineNumber: number } {
  const lines1 = input.slice(0, start).split('\n')
  const lines2 = input.slice(start, end).split('\n')
  const last1 = lines1[lines1.length - 1] ?? ''
  const last2 = lines2[lines2.length - 1] ?? ''
  const start1 = last1.length + 1
  const start2 = lines2.length > 1 ? last2.length + 1 : last2.length + start1

  return {
    startColumn: start1,
    startLineNumber: lines1.length,
    endColumn: start2,
    endLineNumber: lines1.length + lines2.length - 1,
  }
}
