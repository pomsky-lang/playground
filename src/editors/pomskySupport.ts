import { editor, MarkerSeverity } from 'monaco-editor'
import init, { compile, PomskyDiagnostic } from 'pomsky-wasm'

export { init }

export interface CompileResult {
  output?: string
  diagnostics?: Diagnostic[]
}

export interface Diagnostic extends editor.IMarkerData {
  title: string
  help?: string
}

interface Options {
  flavor?: 'js' | 'javascript' | 'java' | '.net' | 'dotnet' | 'python' | 'ruby' | 'rust' | 'pcre'
}

export function compilePomsky(input: string, options?: Options): CompileResult {
  try {
    const { output, diagnostics } = compile(input, options?.flavor ?? 'js')

    return {
      output: output ?? undefined,
      diagnostics: diagnostics.map((w) => convert(input, w)),
    }
  } catch (e) {
    console.error(e)
    return { diagnostics: [] }
  }
}

function convert(
  input: string,
  { severity, kind, code, help, message, range: [start, end] }: PomskyDiagnostic,
): Diagnostic {
  const lines1 = input.slice(0, start).split('\n')
  const lines2 = input.slice(start, end).split('\n')
  const last1 = lines1[lines1.length - 1] ?? ''
  const last2 = lines2[lines2.length - 1] ?? ''
  const start1 = last1.length + 1
  const start2 = lines2.length > 1 ? last2.length + 1 : last2.length + start1

  return {
    severity: severity === 'error' ? MarkerSeverity.Error : MarkerSeverity.Warning,
    startColumn: start1,
    startLineNumber: lines1.length,
    endColumn: start2,
    endLineNumber: lines1.length + lines2.length - 1,
    message: help != null ? `${message}\n\nHelp: ${help}` : message,
    title: message,
    help: help ?? undefined,
    code: `${kind} (${code})`,
  }
}
