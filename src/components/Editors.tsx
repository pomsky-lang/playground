import { editor } from 'monaco-editor'
import { useEffect, useState } from 'react'

import { initMonaco, defaultEditorSettings } from '../monacoConfig'
import { init, compilePomsky, CompileResult } from '../editors/pomskySupport'
import { useLocalStorage, useMonacoEditor } from '../hooks'
import { Output } from './Output'
import css from './Editors.module.scss'

export const flavors = ['js', 'java', 'pcre', 'ruby', 'python', 'rust', 'dotnet'] as const
export type Flavor = typeof flavors[number]

initMonaco()

interface EditorProps {
  editorValue: string
  setEditorValue(newValue: string): void
  tabSize: number
  fontSize: number
}

export function Editors({ editorValue, setEditorValue, tabSize, fontSize }: EditorProps) {
  const [wasmInit, setWasmInit] = useState(false)
  const [result, setResult] = useState<CompileResult>({ output: '' })
  const [flavor, setFlavor] = useLocalStorage<Flavor>('playgroundFlavor', () => 'js')

  const [editorElem, editorRef] = useMonacoEditor(editorValue, setEditorValue)

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
