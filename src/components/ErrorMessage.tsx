import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CompileResult } from '../editors/pomskySupport'
import css from './ErrorMessage.module.scss'

interface Args {
  result: CompileResult
}

export function ErrorMessage({ result }: Args) {
  if (typeof result === 'string') {
    return <></>
  } else {
    return (
      <div className={css.outer}>
        <span className={css.position}>
          <b>Error</b> in line {result.startLineNumber}, column {result.startColumn}:
        </span>
        <span className={css.error}>{result.title}</span>
        {result.help && (
          <div className={css.help}>
            <b>Help:</b> {result.help}
          </div>
        )}
      </div>
    )
  }
}
