import { editor, MarkerSeverity } from 'monaco-editor'
import init, {
  compile,
  PomskyDiagnostic,
  PomskyError,
} from '../../pomsky/pomsky-wasm/pkg/pomsky_wasm.js'

export { init }

export interface CompileResult {
  output?: string
  diagnostics?: Diagnostic[]
}

export interface Diagnostic extends editor.IMarkerData {
  title: string
  help?: string
}

export function compilePomsky(input: string, options?: { flavor?: string }): CompileResult {
  try {
    const { output, warnings } = compile(input, options?.flavor ?? 'js')
    return {
      output,
      diagnostics: warnings.map((w) => convert(input, MarkerSeverity.Warning, w)),
    }
  } catch (e) {
    if (typeof e !== 'object' || e === null || !('diagnostics' in e)) {
      console.error(e)
      return {
        diagnostics: [],
      }
    }

    const { diagnostics } = e as PomskyError
    return {
      diagnostics: diagnostics.map((w) => convert(input, MarkerSeverity.Error, w)),
    }
  }
}

function convert(
  input: string,
  severity: MarkerSeverity,
  { help, message, range: [start, end] }: PomskyDiagnostic,
): Diagnostic {
  const lines1 = input.slice(0, start).split('\n')
  const lines2 = input.slice(start, end).split('\n')
  const last1 = lines1[lines1.length - 1] ?? ''
  const last2 = lines2[lines2.length - 1] ?? ''
  const start1 = last1.length + 1
  const start2 = lines2.length > 1 ? last2.length + 1 : last2.length + start1

  return {
    severity,
    startColumn: start1,
    startLineNumber: lines1.length,
    endColumn: start2,
    endLineNumber: lines1.length + lines2.length - 1,
    message: help != null ? `${message}\n\nHelp: ${help}` : message,
    title: message,
    help: help ?? undefined,
  }
}
