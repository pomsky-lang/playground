import { useState } from 'react'
import { decompressFromUriEncoded } from '../utils/compression'

const urlParams = new URLSearchParams(location.search)

let storeLocally = false

function getEditorInitialValue() {
  const urlParamText = urlParams.get('text')
  if (urlParamText !== null) {
    return urlParamText
  }
  const urlParamC = urlParams.get('c')
  if (urlParamC !== null) {
    return decompressFromUriEncoded(urlParamC)
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
