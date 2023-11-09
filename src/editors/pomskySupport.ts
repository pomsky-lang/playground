import { type editor, MarkerSeverity } from 'monaco-editor'
import init, { compile, type PomskyDiagnostic } from '@pomsky-lang/compiler-web'
import { convertRange } from './convertRange'
import { runTests } from './workers'

export { init }

export interface CompileResult {
  input: string
  output?: string
  diagnostics?: Diagnostic[]
  testDiagnostics?: Promise<Diagnostic[]>
}

export interface Diagnostic extends editor.IMarkerData {
  title: string
  help?: string
}

interface Options {
  flavor?: 'js' | 'javascript' | 'java' | '.net' | 'dotnet' | 'python' | 'ruby' | 'rust' | 'pcre'
  runTests?: boolean
}

export function compilePomsky(input: string, options?: Options): CompileResult {
  try {
    const flavor = options?.flavor ?? 'js'
    const { output, diagnostics, tests } = compile(input, flavor)

    const newDiagnostics = diagnostics.map((w) => convert(input, w))

    let testDiagnostics: Promise<Diagnostic[]> | undefined
    if (
      options?.runTests &&
      output != null &&
      tests != null &&
      (flavor === 'js' || flavor === 'javascript')
    ) {
      testDiagnostics = runTests({ input, output, tests })
    }

    return {
      input,
      output: output ?? undefined,
      diagnostics: newDiagnostics,
      testDiagnostics,
    }
  } catch (e) {
    console.error(e)
    return { input, diagnostics: [] }
  }
}

function convert(
  input: string,
  { severity, kind, code, help, message, range }: PomskyDiagnostic,
): Diagnostic {
  return {
    severity: severity === 'error' ? MarkerSeverity.Error : MarkerSeverity.Warning,
    ...convertRange(input, range),
    message: help != null ? `${message}\n\nHelp: ${help}` : message,
    title: message,
    help: help ?? undefined,
    code: `${kind} (${code})`,
  }
}
