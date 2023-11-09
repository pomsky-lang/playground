import { editor } from 'monaco-editor'
import { useEffect } from 'react'

import { initMonaco, defaultEditorSettings } from '../monacoConfig'
import { useMonacoEditor } from '../hooks'
import { Output } from './Output'
import css from './Editors.module.scss'
import { err } from '../utils/err'
import { type Flavor, useCompilationResult } from '../hooks/useCompilationResult'

initMonaco()

export interface EditorConfigSettings {
  'tabSize': number
  'fontSize': number
  'fontFamily': string
  'wordWrap': 'off' | 'on'
  'renderWhitespace': 'none' | 'boundary' | 'selection' | 'trailing' | 'all'
  'cursorStyle': 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin'
  'multiCursorModifer': 'ctrlCmd' | 'alt'
  'insertSpaces': boolean
  'bracketPairColorization.enabled': boolean
  'minimap': { enabled: boolean }
}

interface EditorProps {
  editorValue: string
  setEditorValue(newValue: string): void
  flavor: Flavor
  setFlavor(newFlavor: Flavor): void
  config: EditorConfigSettings
}

export function Editors({ editorValue, setEditorValue, flavor, setFlavor, config }: EditorProps) {
  const result = useCompilationResult(editorValue, flavor)
  const [editorElem, editorRef] = useMonacoEditor(editorValue, setEditorValue)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(config)
    } else {
      type Setting = string | number | boolean
      type Settings = Record<string, Setting | Record<string, Setting>>

      const defaults = defaultEditorSettings as Settings
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cfg = config as any as Settings

      for (const key in cfg) {
        const innerCfg = cfg[key]
        if (innerCfg && typeof innerCfg === 'object') {
          const innerDefaults = (defaults[key] ??= {}) as Record<string, Setting>
          for (const innerKey in innerCfg) {
            innerDefaults[innerKey] = innerCfg[innerKey]
          }
        } else {
          defaults[key] = cfg[key]
        }
      }
    }
  }, [config])

  useEffect(() => {
    const pomskyEditor = editorRef.current
    if (pomskyEditor == null) return

    const model = pomskyEditor.getModel() ?? err('no monaco text model')
    editor.setModelMarkers(model, '', result.diagnostics ?? [])
  }, [result])

  const editorStyle =
    window.innerWidth > 900
      ? { height: 'calc(100vh - var(--header-height))', width: 'calc(50vw - 10px)' }
      : { height: 'min(50vh, 400px)', width: 'calc(100vw - 10px)' }

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
