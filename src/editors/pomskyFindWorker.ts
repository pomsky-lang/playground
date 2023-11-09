import type { FindMessage } from './workers'

self.onmessage = ({ data }: MessageEvent<FindMessage>) => {
  try {
    const output = search(data)
    self.postMessage({ output })
  } catch (e) {
    self.postMessage({ error: e instanceof Error ? e.message : 'Searching failed or timed out' })
  }
}

function search({ regex, haystack, ignoreCase, limit = Infinity }: FindMessage): RegExpExecArray[] {
  const compiled = new RegExp(regex, ignoreCase ? 'giu' : 'gu')

  const results: RegExpExecArray[] = []
  let _res: RegExpExecArray | null
  let prevLastIndex = 0

  while (limit-- > 0 && (_res = compiled.exec(haystack)) != null) {
    results.push(_res)
    if (compiled.lastIndex === prevLastIndex) {
      compiled.lastIndex++
    }
    prevLastIndex = compiled.lastIndex
  }

  return results
}
