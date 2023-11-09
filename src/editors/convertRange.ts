// Duplicated in the web worker because vite hates me if I try to import it there

export function convertRange(
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
