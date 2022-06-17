import { tokenizeRegex } from './tokenizeRegex'

export function highlight(text: string, language: 'regex'): Node {
  const spans = tokenizeRegex(text)
  const elems = document.createDocumentFragment()
  let offset = 0

  for (const [token, start, end] of spans) {
    if (start > offset) {
      elems.append(text.slice(offset, start))
    }
    const span = document.createElement('span')
    span.className = token
    span.textContent = text.slice(start, end)
    elems.append(span)

    offset = end
  }

  if (text.length > offset) {
    elems.append(text.slice(offset, text.length))
  }

  return elems
}
