import { editor, languages, MarkerSeverity } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { useEffect, useRef, useState } from 'react'
import { completionItems } from '../editors/completions'

import { defaultEditorSettings } from '../editors/editorSettings'
import { highlight } from '../editors/highlight'
import { languageConfiguration, languageDefinition } from '../editors/languageDefinition'
import { init, compileRulex } from '../editors/rulexSupport'
import css from './Editors.module.scss'

const urlParams = new URLSearchParams(location.search)

let storeLocally = false

function getEditorInitialValue() {
  const urlParamContent = urlParams.get('text')
  if (urlParamContent !== null) {
    return decodeURIComponent(atob(urlParamContent))
  }

  storeLocally = true
  const local = localStorage.getItem('playgroundText')
  if (local !== null) {
    return local
  }

  return `# enter rulex expression here
<< 'example'
`
}

const initialValue = getEditorInitialValue()

window.MonacoEnvironment = {
  getWorker: () => new editorWorker(),
}

languages.register({ id: 'rulex' })
languages.setMonarchTokensProvider('rulex', languageDefinition)
languages.setLanguageConfiguration('rulex', languageConfiguration)
languages.registerCompletionItemProvider('rulex', completionItems)

editor.setTheme('vs-dark')

async function initEditors(
  rulexEditorTarget: HTMLElement,
  regexEditorTarget: HTMLElement,
): Promise<editor.IStandaloneCodeEditor> {
  const rulexEditor = editor.create(rulexEditorTarget, {
    value: initialValue,
    language: 'rulex',
    ...defaultEditorSettings,
  })

  const lines = initialValue.split('\n')
  const lineNumber = lines.length
  const lastLine = lines[lines.length - 1]
  const column = lastLine.length + 1

  rulexEditor.setPosition({ lineNumber, column })
  rulexEditor.focus()
  rulexEditor.revealLineInCenter(lineNumber)

  await init()

  const syncEditors = () => {
    const value = rulexEditor.getValue()
    window.currentEditorContent = value
    if (storeLocally) {
      localStorage.setItem('playgroundText', value)
    }

    const result = compileRulex(value)
    if (typeof result === 'string') {
      regexEditorTarget.innerText = ''
      regexEditorTarget.append(highlight(result, 'regex'))
      regexEditorTarget.classList.add(css.valid)
      editor.setModelMarkers(rulexEditor.getModel()!, '', [])
    } else {
      editor.setModelMarkers(rulexEditor.getModel()!, '', [result])
      regexEditorTarget.classList.remove(css.valid)
    }
  }

  syncEditors()

  rulexEditor.getModel()?.onDidChangeContent(syncEditors)

  return rulexEditor
}

export function Editors() {
  const rulexEditorEl = useRef<HTMLElement>()
  const regexEditorEl = useRef<HTMLElement>()
  const editor = useRef<editor.IStandaloneCodeEditor>()

  const [shouldInitialize, setShouldInitialize] = useState(false)

  useEffect(() => {
    if (rulexEditorEl.current != null && regexEditorEl.current != null) {
      setShouldInitialize(true)
    }

    return () => {
      if (editor.current) {
        editor.current.dispose()
        editor.current.getDomNode()?.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (shouldInitialize) {
      initEditors(rulexEditorEl.current!, regexEditorEl.current!).then((e) => {
        editor.current = e
      })
    }
  }, [shouldInitialize])

  const editorStyle =
    window.innerWidth > 800
      ? { height: 'calc(100vh - 60px)', width: '50vw' }
      : { height: 'min(50vh, 400px)', width: '100vw' }

  return (
    <div className={css.divs}>
      <div className={css.rulexPart}>
        <div
          style={editorStyle}
          ref={(ref) => {
            if (ref != null) rulexEditorEl.current = ref
          }}
        />
      </div>
      <div className={css.regexPart}>
        <div
          className={`${css.inner} ${css.valid}`}
          tabIndex={0}
          ref={(ref) => {
            if (ref != null) regexEditorEl.current = ref
          }}
        />
      </div>
    </div>
  )
}
