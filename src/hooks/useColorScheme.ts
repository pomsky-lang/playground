import { useEffect, useState } from 'react'

const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')

export function currentPrefColorScheme() {
  return { preferDark: matchMedia.matches }
}

export function addPrefColorSchemeListener(listener: (e: { preferDark: boolean }) => void) {
  matchMedia.addEventListener('change', () => {
    listener({ preferDark: matchMedia.matches })
  })
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
