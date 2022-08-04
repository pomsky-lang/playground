import { useCallback, useState } from 'react'
import { useWindowHeight, useWindowWidth } from '../hooks/useWindowSize'
import css from './App.module.scss'
import { Editors } from './Editors'

export function App() {
  const [editorValue, setEditorValue] = useState('')
  const [copied, setCopied] = useState(false)

  // this ensures the component is re-rendered when the screen size changes
  const _ = useWindowWidth()

  const share = useCallback(() => {
    history.pushState({}, '', location.pathname + '?text=' + encodeURIComponent(editorValue))

    function copyTextToClipboard(text: string) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }
    }

    copyTextToClipboard(location.href)
  }, [editorValue])

  return (
    <>
      <header className={css.header}>
        <h1>
          <div className={css.name}>Pomsky</div>
          <div className={css.caption}>Playground</div>
        </h1>

        <div className={css.flexGrow}>
          <a href="https://pomsky-lang.org/docs/get-started/introduction/">Docs</a>
          <a href="https://github.com/rulex-rs/pomsky" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>

        <div className={css.relative}>
          <a onClick={share}>Share</a>
          {copied && <div className={css.tooltip}>Copied URL to clipboard!</div>}
        </div>
      </header>
      <Editors editorValue={editorValue} setEditorValue={setEditorValue} />
    </>
  )
}
