import { useState } from 'react'
import { Flavor } from '../components/Editors'

const urlParams = new URLSearchParams(location.search)

const storeLocally = false

function getEditorInitialFlavor(): Flavor {
  const urlParamFlavor = urlParams.get('flavor')
  if (urlParamFlavor !== null) {
    return urlParamFlavor as Flavor
  }
  return 'js'
}

export function useEditorFlavor() {
  const [flavor, setFlavor] = useState(getEditorInitialFlavor)

  return [
    flavor,
    (newFlavor: Flavor) => {
      if (storeLocally) {
        localStorage.setItem('playgroundFlavor', newFlavor)
      }
      setFlavor(newFlavor)
    },
  ] as const
}
