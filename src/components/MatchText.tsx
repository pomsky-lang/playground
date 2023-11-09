import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks'
import { Matches } from './Matches'
import css from './MatchText.module.scss'
import { runSearch } from '../editors/workers'
import type { Rejection } from '../utils/workerQueue'

interface Args {
  regex: string
}

export function MatchText({ regex }: Args) {
  const [ignoreCase, setIgnoreCase] = useLocalStorage('playgroundIgnoreCase', () => false)
  const [matchText, setMatchText] = useLocalStorage('playgroundMatchText', () => '')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [matches, setMatches] = useState<RegExpExecArray[]>([])

  const ref = useRef({ regex, ignoreCase, matchText })

  useEffect(() => {
    ref.current.ignoreCase = ignoreCase
    ref.current.matchText = matchText
    ref.current.regex = regex
    setMatches([])
    setSearchError(null)
    setBusy(true)

    runSearch({ haystack: matchText, regex, ignoreCase, limit: 5000 })
      .then((out) => {
        if (
          ref.current.ignoreCase === ignoreCase &&
          ref.current.matchText === matchText &&
          ref.current.regex === regex
        ) {
          setMatches(out)
          setSearchError(null)
          setBusy(false)
        }
      })
      .catch((error: Rejection<string>) => {
        if (error === 'cancel') return
        if (
          ref.current.ignoreCase === ignoreCase &&
          ref.current.matchText === matchText &&
          ref.current.regex === regex
        ) {
          setMatches([])
          setSearchError(error.error)
          setBusy(false)
        }
      })
  }, [matchText, regex, ignoreCase])

  return (
    <div className={css.outer}>
      <div className={css.topPanel}>
        <label>
          <input
            type="checkbox"
            className={css.ignoreCaseInput}
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
          />
          Ignore case
        </label>
        <div className={`${css.matches} ${matches.length ? css.success : ''}`}>
          {busy ? (
            <span className={css.searchingIndicator}>Searching...</span>
          ) : matches.length === 0 ? (
            'No match'
          ) : matches.length === 1 ? (
            '1 match'
          ) : (
            `${matches.length} matches`
          )}
        </div>
      </div>
      {searchError != null && (
        <div className={css.errorPanel}>
          <b>Error:</b> {searchError}
          <br />
          {searchError !== 'too much recursion' && (
            <div className={css.bug}>
              If you think this is a bug, you can{' '}
              <a
                href="https://github.com/pomsky-lang/pomsky/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                report it here
              </a>
              .
            </div>
          )}
        </div>
      )}
      <textarea
        className={css.input}
        placeholder="Enter text to match..."
        value={matchText}
        onChange={(e) => setMatchText(e.target.value)}
      />
      {matches.length > 0 && <Matches matches={matches} string={matchText} />}
    </div>
  )
}
