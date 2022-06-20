import { ReactNode } from 'react'
import { tokenizeRegex } from './tokenizeRegex'

export function highlight(text: string, language: 'regex'): ReactNode[] {
  const spans = tokenizeRegex(text)
  let offset = 0
  let key = 0

  return spans.flatMap(([token, start, end], index) => {
    const elems: ReactNode[] = []
    if (start > offset) {
      elems.push(text.slice(offset, start))
    }
    elems.push(
      <span className={token} key={key++}>
        {text.slice(start, end)}
      </span>,
    )

    offset = end

    if (index === spans.length - 1 && text.length > offset) {
      elems.push(text.slice(offset, text.length))
    }

    return elems
  })
}
