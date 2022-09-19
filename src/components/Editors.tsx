import { editor } from 'monaco-editor'
import { useEffect, useState } from 'react'

import { initMonaco, defaultEditorSettings } from '../monacoConfig'
import { init, compilePomsky, CompileResult } from '../editors/pomskySupport'
import { useLocalStorage, useMonacoEditor } from '../hooks'
import { Output } from './Output'
import css from './Editors.module.scss'
import { err } from '../utils/err'

export const flavors = ['js', 'java', 'pcre', 'ruby', 'python', 'rust', 'dotnet'] as const
export type Flavor = typeof flavors[number]

initMonaco()

export interface EditorConfigSettings {
  tabSize: number
  fontSize: number
  fontFamily: string
  wordWrap: 'off' | 'on'
}

interface EditorProps {
  editorValue: string
  setEditorValue(newValue: string): void
  config: EditorConfigSettings
}

export function Editors({ editorValue, setEditorValue, config }: EditorProps) {
  const [wasmInit, setWasmInit] = useState(false)
  const [result, setResult] = useState<CompileResult>({ output: '' })
  const [flavor, setFlavor] = useLocalStorage<Flavor>('playgroundFlavor', () => 'js')

  const [editorElem, editorRef] = useMonacoEditor(editorValue, setEditorValue)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(config)
    } else {
      defaultEditorSettings.fontSize = config.fontSize
      defaultEditorSettings.tabSize = config.tabSize
      defaultEditorSettings.fontFamily = config.fontFamily
      defaultEditorSettings.wordWrap = config.wordWrap
    }
  }, [config])

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

    const model = pomskyEditor.getModel() ?? err('no monaco text model')
    editor.setModelMarkers(model, '', result.diagnostics ?? [])
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
        <Output
          result={result}
          flavor={flavor}
          onFlavorChange={setFlavor}
          style={{
            fontFamily: config.fontFamily,
            fontSize: config.fontSize,
          }}
        />
      </div>
    </div>
  )
}
