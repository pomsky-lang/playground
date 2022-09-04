import { useState } from 'react'

const urlParams = new URLSearchParams(location.search)

let storeLocally = false

function getEditorInitialValue() {
  const urlParamContent = urlParams.get('text')
  if (urlParamContent !== null) {
    return urlParamContent
  }

  storeLocally = true
  const local = localStorage.getItem('playgroundText')
  if (local !== null) {
    return local
  }

  return `# enter pomsky expression here
<< 'example'
`
}

export function useEditorValue() {
  const [value, setValue] = useState(getEditorInitialValue)

  return [
    value,
    (newValue: string) => {
      if (storeLocally) {
        localStorage.setItem('playgroundText', newValue)
      }
      setValue(newValue)
    },
  ] as const
}
