import { Dispatch, useState } from 'react'

interface Options {
  clearWhenDefault?: boolean
  storageArea?: Storage
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: () => T,
  options?: Options,
): [T, Dispatch<T>] {
  const clearWhenDefault = options?.clearWhenDefault ?? true
  const storageArea = options?.storageArea ?? localStorage

  const [value, setValue] = useState<T>(() => {
    const stored = storageArea.getItem(key)
    if (stored == null) {
      const value = defaultValue()
      if (!clearWhenDefault) {
        localStorage.setItem(key, JSON.stringify(value))
      }
      return value
    } else {
      try {
        const parsed = JSON.parse(stored)
        if (typeof parsed === 'object') {
          return { ...defaultValue(), ...parsed }
        } else {
          return parsed
        }
      } catch {
        return defaultValue()
      }
    }
  })

  window.addEventListener('storage', (event) => {
    if (event.key === key && event.storageArea === storageArea) {
      if (event.newValue === null) {
        setValue(defaultValue())
      } else {
        try {
          setValue(JSON.parse(event.newValue))
        } catch {}
      }
    }
  })

  function newSetValue(value: T) {
    if (clearWhenDefault && value === defaultValue()) {
      storageArea.removeItem(key)
    } else {
      storageArea.setItem(key, JSON.stringify(value))
    }
    setValue(value)
  }

  return [value, newSetValue]
}
