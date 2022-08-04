import { useEffect, useState } from 'react'

const widthCallbacks: ((width: number) => void)[] = []
const heightCallbacks: ((height: number) => void)[] = []

const observer = new ResizeObserver(() => {
  const width = window.innerWidth
  const height = window.innerHeight
  widthCallbacks.forEach((callback) => callback(width))
  heightCallbacks.forEach((callback) => callback(height))
})

observer.observe(document.body)

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    widthCallbacks.push(setWidth)

    return () => {
      const found = widthCallbacks.findIndex((cb) => cb === setWidth)
      if (found >= 0) {
        widthCallbacks.splice(found, 1)
      }
    }
  }, [])

  return width
}

export function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    heightCallbacks.push(setHeight)

    return () => {
      const found = heightCallbacks.findIndex((cb) => cb === setHeight)
      if (found >= 0) {
        heightCallbacks.splice(found, 1)
      }
    }
  }, [])

  return height
}
