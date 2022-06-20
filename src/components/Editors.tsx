import { editor, languages } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { useEffect, useRef, useState } from 'react'
import { completionItems } from '../editors/completions'

import { defaultEditorSettings } from '../editors/editorSettings'
import { languageConfiguration, languageDefinition } from '../editors/languageDefinition'
import { init, compileRulex, CompileResult } from '../editors/rulexSupport'
import css from './Editors.module.scss'
import { Output } from './Output'

export const flavors = ['js', 'java', 'pcre', 'ruby', 'python', 'rust', 'dotnet'] as const
export type Flavor = typeof flavors[number]

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

async function initEditor(
  editorTarget: HTMLElement,
  setResult: (value: string) => void,
): Promise<editor.IStandaloneCodeEditor> {
  const rulexEditor = editor.create(editorTarget, {
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

  const syncEditors = () => {
    const value = rulexEditor.getValue()
    window.currentEditorContent = value
    if (storeLocally) {
      localStorage.setItem('playgroundText', value)
    }

    setResult(value)
  }

  syncEditors()

  rulexEditor.getModel()?.onDidChangeContent(syncEditors)

  return rulexEditor
}

export function Editors() {
  const editorElem = useRef<HTMLElement>()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()

  const [shouldInitialize, setShouldInitialize] = useState(false)
  const [wasmInit, setWasmInit] = useState(false)
  const [editorValue, setEditorValue] = useState('')
  const [result, setResult] = useState<CompileResult>('')
  const [flavor, setFlavor] = useState<Flavor>('js')

  useEffect(() => {
    if (editorElem.current != null) {
      setShouldInitialize(true)
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose()
        editorRef.current.getDomNode()?.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (shouldInitialize) {
      initEditor(editorElem.current!, setEditorValue).then((e) => {
        editorRef.current = e
      })
    }
  }, [shouldInitialize])

  useEffect(() => {
    if (!wasmInit) {
      init().then(() => {
        setWasmInit(true)
        setResult(compileRulex(editorValue, { flavor }))
      })
    } else {
      setResult(compileRulex(editorValue, { flavor }))
    }
  }, [editorValue, flavor])

  useEffect(() => {
    const rulexEditor = editorRef.current
    if (rulexEditor == null) return

    editor.setModelMarkers(rulexEditor.getModel()!, '', typeof result === 'string' ? [] : [result])
  }, [result])

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
            if (ref != null) editorElem.current = ref
          }}
        />
      </div>
      <div className={css.regexPart}>
        <Output result={result} flavor={flavor} onFlavorChange={setFlavor} />
      </div>
    </div>
  )
}
