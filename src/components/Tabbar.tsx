import { useContext } from 'react'
import css from './Tabbar.module.scss'
import { AppContext } from './App'

interface Args<T extends string> {
  tabs: Record<T, Tab>
  selected: T
  onSelect(name: T): void
}

export interface Tab {
  name: string
  disabled?: boolean
  title?: string
}

export function Tabbar<T extends string>({ tabs, selected, onSelect }: Args<T>) {
  const { isTesting } = useContext(AppContext)

  return (
    <div className={css.tabs}>
      {(Object.keys(tabs) as T[]).map((key) => (
        <button
          key={key}
          className={selected === key ? css.selected : ''}
          onClick={() => onSelect(key)}
          disabled={tabs[key].disabled}
          title={tabs[key].title}
        >
          {tabs[key].name}
        </button>
      ))}
      <span className={`${css.testIndicator} ${isTesting ? css.visible : ''}`}>testing...</span>
    </div>
  )
}
