import { ReactNode, useEffect, useState } from 'react'
import css from './Matches.module.scss'

interface Args {
  matches: RegExpExecArray[]
  string: string
}

export function Matches({ matches, string }: Args) {
  const [selected, setSelected] = useState<number | null>(null)
  const [prevMatches, setPrevMatches] = useState(matches)

  useEffect(() => {
    if (matches.length !== prevMatches.length) {
      if (
        selected != null &&
        (selected >= matches.length || matches[selected][0] !== prevMatches[selected][0])
      ) {
        setSelected(null)
      }
      setPrevMatches(matches)
    }
  }, [matches, string, selected])

  const segments: ReactNode[] = []
  let offset = 0
  let index = 0

  for (const match of matches) {
    const thisIndex = index++

    if (match.index > offset) {
      segments.push(string.slice(offset, match.index))
    }
    segments.push(
      <span
        role="button"
        tabIndex={0}
        className={match.index > offset ? css.match : `${css.match} ${css.adjacent}`}
        key={thisIndex}
        onClick={() => setSelected(thisIndex)}
      >
        {match[0]}
      </span>,
    )

    offset = match.index + match[0].length
  }

  if (offset < string.length) {
    segments.push(string.slice(offset))
  }

  return (
    <>
      <div className={css.outer}>{segments}</div>
      {selected != null && selected < matches.length && (
        <div className={css.detail}>
          <div className={css.detailTitle}>Match {selected}:</div>
          <div className={css.detailMatch}>
            <div className={css.wholeMatch}>{matches[selected][0]}</div>
            <table>
              <tbody>
                {matches[selected].slice(1).map((match, index) => (
                  <tr>
                    <td>{index}:</td>
                    <td>
                      <code className={match === '' ? css.empty : ''}>{match}</code>
                    </td>
                  </tr>
                ))}
                {Object.entries(matches[selected].groups ?? {}).map(([groupName, match], i) => (
                  <tr key={i}>
                    <td>
                      <code>{groupName}</code>:
                    </td>
                    <td>
                      <code>{match}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
