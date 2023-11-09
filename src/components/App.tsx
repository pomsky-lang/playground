import { createContext, useCallback, useEffect, useState } from 'react'
import { useWindowWidth, useLocalStorage } from '../hooks'
import css from './App.module.scss'
import { type EditorConfigSettings, Editors } from './Editors'
import settings from '../assets/settings.svg?raw'
import logo from '../assets/logo.svg?raw'
import { useEditorValue } from '../hooks/useEditorValue'
import { EditorConfig } from './EditorConfig'
import { useEditorFlavor } from '../hooks/useEditorFlavor'
import { compressToUriEncoded } from '../utils/compression'

interface AppContext {
  isTesting: boolean
  setIsTesting: (isTesting: boolean) => void
}

export const AppContext = createContext<AppContext>(undefined as never)

export function App() {
  const [editorValue, setEditorValue] = useEditorValue()
  const [flavor, setFlavor] = useEditorFlavor()
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isTesting, setIsTesting] = useState(false)

  const [editorConfig, setEditorConfig] = useLocalStorage<EditorConfigSettings>(
    'editorConfig',
    () => ({
      'tabSize': 2,
      'fontSize': window.innerWidth > 900 ? 17 : window.innerWidth > 560 ? 16 : 15,
      'fontFamily': "'JetBrains Mono', monospace",
      'wordWrap': 'on',
      'renderWhitespace': 'selection',
      'cursorStyle': 'line',
      'multiCursorModifer': 'alt',
      'insertSpaces': true,
      'bracketPairColorization.enabled': true,
      'minimap': { enabled: false },
    }),
  )

  // this ensures the component is re-rendered when the screen size changes
  useWindowWidth()

  const share = useCallback(async () => {
    const compressed = compressToUriEncoded(editorValue)
    history.pushState({}, '', `${location.pathname}?flavor=${flavor}&c=${compressed}`)

    if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }, [editorValue])

  useEffect(() => {
    const listener = (e: Event) => {
      if (e instanceof MouseEvent && isSidebarOrSettingsButton(e.target as HTMLElement)) return
      setSidebarOpen(false)
    }

    function isSidebarOrSettingsButton(e: HTMLElement | null): boolean {
      if (e == null) return false
      return (
        e.id === 'settingsButton' ||
        e.id === 'sidebar' ||
        isSidebarOrSettingsButton(e.parentElement)
      )
    }

    document.body.addEventListener('click', listener)

    return () => {
      document.body.removeEventListener('click', listener)
    }
  }, [])

  return (
    <AppContext.Provider value={{ isTesting, setIsTesting }}>
      <header className={css.header}>
        <span className={css.logo} dangerouslySetInnerHTML={{ __html: logo }}></span>
        <h1>Playground</h1>
        <a className={css.hideSmall} href="https://pomsky-lang.org/">
          Home
        </a>
        <a
          className={css.hideSmall}
          href="https://github.com/pomsky-lang/pomsky"
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
            id="settingsButton"
            className={css.settings}
            dangerouslySetInnerHTML={{ __html: settings }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          ></button>
        </div>
      </header>

      <Editors
        editorValue={editorValue}
        setEditorValue={setEditorValue}
        flavor={flavor}
        setFlavor={setFlavor}
        config={editorConfig}
      />

      <div id="sidebar" className={`${css.sidebar} ${sidebarOpen ? css.open : ''}`}>
        <div className={css.sidebarHeader}>
          <h1>Editor Settings</h1>
          <div className={css.flexGrow} />

          <button className={css.close} onClick={() => setSidebarOpen(!sidebarOpen)}></button>
        </div>
        <div className={css.content}>
          <EditorConfig config={editorConfig} setConfig={setEditorConfig} />
        </div>
      </div>
    </AppContext.Provider>
  )
}
