import { editor, languages } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { useEffect, useRef, useState } from 'react'
import { completionItems } from '../monacoConfig/completionItems'

import { defaultEditorSettings } from '../monacoConfig/editorSettings'
import { languageDefinition } from '../monacoConfig/languageDefinition'
import { languageConfiguration } from '../monacoConfig/languageConfiguration'
import { init, compilePomsky, CompileResult } from '../editors/pomskySupport'
import { currentPreferredColorScheme } from '../hooks/useColorScheme'
import { useLocalStorage } from '../hooks/useLocalStorage'
import css from './Editors.module.scss'
import { Output } from './Output'

export const flavors = ['js', 'java', 'pcre', 'ruby', 'python', 'rust', 'dotnet'] as const
export type Flavor = typeof flavors[number]

const urlParams = new URLSearchParams(location.search)

let storeLocally = false

function getEditorInitialValue() {
  const urlParamContent = urlParams.get('text')
  if (urlParamContent !== null) {
    return urlParamContent
  }

  storeLocally = true
  const local = localStorage.getItem('playgroundText')
  if (local !== null) {
    return local
  }

  return `# enter pomsky expression here
<< 'example'
`
}

const initialValue = getEditorInitialValue()

window.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

languages.register({ id: 'pomsky' })
languages.setMonarchTokensProvider('pomsky', languageDefinition)
languages.setLanguageConfiguration('pomsky', languageConfiguration)
languages.registerCompletionItemProvider('pomsky', completionItems)

editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '69ace3' },
    { token: 'string', foreground: 'dca088' },
    { token: 'string.escape', foreground: 'ffcc77', fontStyle: 'bold' },
    { token: 'string.invalid', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'constant.numeric', foreground: 'b5cea8' },
    { token: 'variable', foreground: '9cdcfe' },
  ],
  colors: {},
})

editor.defineTheme('custom-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '0000ff' },
    { token: 'string', foreground: 'a31515' },
    { token: 'string.escape', foreground: '734141', fontStyle: 'bold' },
    { token: 'string.invalid', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'constant.numeric', foreground: '097000' },
    { token: 'variable', foreground: '000000' },
  ],
  colors: {},
})

editor.setTheme(currentPreferredColorScheme().preferDark ? 'custom-dark' : 'custom-light')

async function initEditor(
  editorTarget: HTMLElement,
  setResult: (value: string) => void,
): Promise<editor.IStandaloneCodeEditor> {
  const pomskyEditor = editor.create(editorTarget, {
    ...defaultEditorSettings,
    value: initialValue,
    language: 'pomsky',
    theme: currentPreferredColorScheme().preferDark ? 'custom-dark' : 'custom-light',
  })

  const lines = initialValue.split('\n')
  const lineNumber = lines.length
  const lastLine = lines[lines.length - 1]
  const column = lastLine.length + 1

  pomskyEditor.setPosition({ lineNumber, column })
  pomskyEditor.focus()
  pomskyEditor.revealLineInCenter(lineNumber)

  const syncEditors = () => {
    const value = pomskyEditor.getValue()
    window.currentEditorContent = value
    if (storeLocally) {
      localStorage.setItem('playgroundText', value)
    }

    setResult(value)
  }

  syncEditors()

  pomskyEditor.getModel()?.onDidChangeContent(syncEditors)

  return pomskyEditor
}

interface EditorProps {
  editorValue: string
  setEditorValue(newValue: string): void
  tabSize: number
  fontSize: number
}

export function Editors({ editorValue, setEditorValue, tabSize, fontSize }: EditorProps) {
  const editorElem = useRef<HTMLElement>()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()

  const [shouldInitialize, setShouldInitialize] = useState(false)
  const [wasmInit, setWasmInit] = useState(false)
  const [result, setResult] = useState<CompileResult>({ output: '' })
  const [flavor, setFlavor] = useLocalStorage<Flavor>('playgroundFlavor', () => 'js')

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
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize, tabSize })
    } else {
      defaultEditorSettings.fontSize = fontSize
      defaultEditorSettings.tabSize = tabSize
    }
  }, [tabSize, fontSize])

  useEffect(() => {
    if (!wasmInit) {
      init().then(() => {
        setWasmInit(true)
        setResult(compilePomsky(editorValue, { flavor }))
      })
    } else {
      setResult(compilePomsky(editorValue, { flavor }))
    }
  }, [editorValue, flavor])

  useEffect(() => {
    const pomskyEditor = editorRef.current
    if (pomskyEditor == null) return

    editor.setModelMarkers(pomskyEditor.getModel()!, '', result.diagnostics ?? [])
  }, [result])

  const editorStyle =
    window.innerWidth > 800
      ? { height: 'calc(100vh - var(--header-height))', width: '50vw' }
      : { height: 'min(50vh, 400px)', width: '100vw' }

  return (
    <div className={css.divs}>
      <div className={css.pomskyPart}>
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
