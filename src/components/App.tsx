import css from './App.module.scss'
import { Editors } from './Editors'

export function App() {
  return (
    <>
      <header className={css.header}>
        <h1>
          Pomsky <span className={css.thin}>Playground</span>
        </h1>

        <div className={css.flexGrow}>
          <a href="https://pomsky-lang.org/docs/get-started/introduction/">Docs</a>
        </div>

        <a href="https://github.com/rulex-rs/pomsky" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </header>
      <Editors />
    </>
  )
}
