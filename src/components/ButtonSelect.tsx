import { useMemo } from 'react'
import { useWindowWidth } from '../hooks'
import css from './ButtonSelect.module.scss'

export interface ButtonSelectProps<T extends string> {
  value: T
  options: { [key in T]: string }
  maxWidth: number
  onChange(key: T): void
}

export function ButtonSelect<T extends string>({
  value,
  options,
  maxWidth,
  onChange,
}: ButtonSelectProps<T>) {
  const entries = useMemo(() => Object.entries(options) as [T, string][], [options])

  const windowWidth = useWindowWidth()
  const parentWidth = useMemo(() => {
    return windowWidth >= 800 ? windowWidth / 2 : windowWidth
  }, [windowWidth])

  if (parentWidth > maxWidth) {
    return (
      <div className={css.buttonSelect}>
        {entries.map(([key, name]) => (
          <button
            key={key}
            className={key === value ? css.active : ''}
            onClick={() => onChange(key)}
          >
            {name}
          </button>
        ))}
      </div>
    )
  } else {
    return (
      <div className={css.nativeSelect}>
        <select value={value} onChange={(e) => onChange(e.target.value as T)}>
          {entries.map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>
    )
  }
}
