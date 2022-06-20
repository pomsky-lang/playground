import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Matches } from './Matches'
import css from './MatchText.module.scss'

interface Args {
  regex: string
}

export function MatchText({ regex }: Args) {
  const [ignoreCase, setIgnoreCase] = useState(
    () => localStorage.getItem('playgroundIgnoreCase') === 'true',
  )
  const [matchText, setMatchText] = useState(
    () => localStorage.getItem('playgroundMatchText') ?? '',
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const compiledRegex = useMemo(() => {
    try {
      const compiled = new RegExp(regex, ignoreCase ? 'giu' : 'gu')
      if (errorMsg != null) {
        setErrorMsg(null)
      }
      return compiled
    } catch (e) {
      setErrorMsg((e as Error).message)
      return /[^\s\S]/g
    }
  }, [regex, ignoreCase])
  const [matches, setMatches] = useState<RegExpExecArray[]>([])

  useEffect(() => {
    const results = []
    compiledRegex.lastIndex = 0
    let previousLastIndex = 0

    for (;;) {
      const next = compiledRegex.exec(matchText)
      if (next == null) break
      results.push(next)

      // don't get stuck
      if (compiledRegex.lastIndex === previousLastIndex) {
        compiledRegex.lastIndex += 1
      }

      previousLastIndex = compiledRegex.lastIndex
    }

    setMatches(results)
  }, [matchText, compiledRegex])

  return (
    <div className={css.outer}>
      <div className={css.topPanel}>
        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              setIgnoreCase(e.target.checked)
              localStorage.setItem('playgroundIgnoreCase', e.target.checked ? 'true' : 'false')
            }}
          />
          Ignore case
        </label>
        <div className={`${css.matches} ${matches.length ? css.success : ''}`}>
          {matches.length === 0
            ? 'No match'
            : matches.length === 1
            ? '1 match'
            : `${matches.length} matches`}
        </div>
      </div>
      {errorMsg != null && (
        <div className={css.errorPanel}>
          <b>Error compiling regex:</b> {errorMsg}
          <br />
          <div className={css.bug}>
            You found a bug! You can{' '}
            <a
              href="https://github.com/rulex-rs/rulex/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              report it here
            </a>
            .
          </div>
        </div>
      )}
      <textarea
        className={css.input}
        placeholder="Enter text to match..."
        value={matchText}
        onChange={(e) => {
          setMatchText(e.target.value)
          localStorage.setItem('playgroundMatchText', e.target.value)
        }}
      />
      {matches.length > 0 && <Matches matches={matches} string={matchText} />}
    </div>
  )
}
