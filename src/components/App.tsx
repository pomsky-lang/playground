import { useCallback, useEffect, useState } from 'react'
import { useWindowWidth, useLocalStorage } from '../hooks'
import css from './App.module.scss'
import { EditorConfigSettings, Editors } from './Editors'
import burger from '../assets/burger.svg?raw'
import { useEditorValue } from '../hooks/useEditorValue'
import { EditorConfig } from './EditorConfig'

export function App() {
  const [editorValue, setEditorValue] = useEditorValue()
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [editorConfig, setEditorConfig] = useLocalStorage<EditorConfigSettings>(
    'editorConfig',
    () => ({
      tabSize: 2,
      fontSize: window.innerWidth > 800 ? 17 : window.innerWidth > 560 ? 16 : 15,
      fontFamily: "'JetBrains Mono', monospace",
      wordWrap: 'on',
    }),
  )

  // this ensures the component is re-rendered when the screen size changes
  const _ = useWindowWidth()

  const share = useCallback(() => {
    history.pushState({}, '', location.pathname + '?text=' + encodeURIComponent(editorValue))

    if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }, [editorValue])

  useEffect(() => {
    const listener = (e: Event) => {
      if (e instanceof MouseEvent && isSidebarOrBurgerButton(e.target as HTMLElement)) return
      setSidebarOpen(false)
    }

    function isSidebarOrBurgerButton(e: HTMLElement | null): boolean {
      if (e == null) return false
      return (
        e.id === 'burgerButton' || e.id === 'sidebar' || isSidebarOrBurgerButton(e.parentElement)
      )
    }

    document.body.addEventListener('click', listener)

    return () => {
      document.body.removeEventListener('click', listener)
    }
  }, [])

  return (
    <>
      <header className={css.header}>
        <h1>
          <div className={css.name}>Pomsky</div>
          <div className={css.caption}>Playground</div>
        </h1>

        <a className={css.hideSmall} href="https://pomsky-lang.org/docs/get-started/introduction/">
          Docs
        </a>
        <a className={css.hideSmall} href="https://pomsky-lang.org/blog/">
          Blog
        </a>
        <a
          className={css.hideSmall}
          href="https://github.com/rulex-rs/pomsky"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <div className={css.flexGrow} />

        <div className={css.relative}>
          <a onClick={share}>Share</a>
          {copied && <div className={css.tooltip}>Copied URL to clipboard!</div>}

          <button
            id="burgerButton"
            className={css.burger}
            dangerouslySetInnerHTML={{ __html: burger }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          ></button>
        </div>
      </header>

      <Editors editorValue={editorValue} setEditorValue={setEditorValue} config={editorConfig} />

      <div id="sidebar" className={`${css.sidebar} ${sidebarOpen ? css.open : ''}`}>
        <div className={css.sidebarHeader}>
          <h1>
            <a href="https://pomsky-lang.org">Pomsky</a>
          </h1>
          <div className={css.flexGrow} />

          <button className={css.close} onClick={() => setSidebarOpen(!sidebarOpen)}></button>
        </div>
        <div className={css.content}>
          <div className={css.hideBig}>
            <a href="https://pomsky-lang.org/docs/get-started/introduction/">Docs</a>
            <a href="https://pomsky-lang.org/blog/">Blog</a>
            <a href="https://github.com/rulex-rs/pomsky">GitHub</a>

            <hr />
          </div>

          <EditorConfig config={editorConfig} setConfig={setEditorConfig} />
        </div>
      </div>
    </>
  )
}
