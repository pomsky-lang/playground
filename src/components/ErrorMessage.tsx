import { MarkerSeverity } from 'monaco-editor'
import { CompileResult } from '../editors/pomskySupport'
import css from './ErrorMessage.module.scss'

interface Args {
  result: CompileResult
}

export function ErrorMessage({ result }: Args) {
  if (result.diagnostics) {
    return (
      <>
        {result.diagnostics
          .filter((d) => d.severity === MarkerSeverity.Error)
          .slice(0, 8)
          .map((error, index) => (
            <div className={css.outer} key={index}>
              <span className={css.position}>
                <b>Error</b> at {error.startLineNumber}:{error.startColumn}:
              </span>
              <span className={css.error}>{error.title}</span>
              {error.help && (
                <div className={css.help}>
                  <b>Help:</b> {error.help}
                </div>
              )}
            </div>
          ))}
      </>
    )
  } else {
    return <></>
  }
}
