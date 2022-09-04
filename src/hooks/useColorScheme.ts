import { useEffect, useState } from 'react'

const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')

export function currentPreferredColorScheme() {
  return { preferDark: matchMedia.matches }
}

export function usePreferredColorScheme() {
  const [preferDark, setPreferDark] = useState(() => matchMedia.matches)

  useEffect(() => {
    const listener = () => {
      console.log(matchMedia.matches)
      setPreferDark(matchMedia.matches)
    }
    matchMedia.addEventListener('change', listener)

    return () => {
      matchMedia.removeEventListener('change', listener)
    }
  })

  return { preferDark }
}
