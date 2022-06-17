import { editor, MarkerSeverity } from 'monaco-editor'
import init, { compile } from '../../rulex-play/pkg/rulex_play.js'

export { init }

export function compileRulex(
  input: string,
  options?: { flavor?: string },
): string | editor.IMarkerData {
  const [success, output, help, s_prefix, s_content]: [boolean, ...string[]] = compile(
    input,
    options?.flavor ?? 'js',
  ) as any

  if (success) {
    return output
  } else {
    const lines1 = s_prefix.split('\n')
    const lines2 = s_content.split('\n')
    const last1 = lines1[lines1.length - 1] ?? ''
    const last2 = lines2[lines2.length - 1] ?? ''
    const start1 = last1.length + 1
    const start2 = lines2.length > 1 ? last2.length + 1 : last2.length + start1

    return {
      severity: MarkerSeverity.Error,
      startColumn: start1,
      startLineNumber: lines1.length,
      endColumn: start2,
      endLineNumber: lines1.length + lines2.length - 1,
      message: help != null ? `${output}\n\nHelp: ${help}` : output,
    }
  }
}
