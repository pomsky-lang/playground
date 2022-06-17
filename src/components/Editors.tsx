import { editor, languages, MarkerSeverity } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { useEffect, useRef, useState } from 'react'

import { defaultEditorSettings } from '../editors/editorSettings'
import { languageDefinition } from '../editors/languageDefinition'
import css from './Editors.module.scss'

import init, { compile } from '../../rulex-play/pkg/rulex_play.js'

const urlParams = new URLSearchParams(location.search)

function getEditorInitialValue() {
  const urlParamContent = urlParams.get('text')
  if (urlParamContent !== null) {
    return decodeURIComponent(atob(urlParamContent))
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

editor.setTheme('vs-dark')

function compileRulex(
  input: string,
  options?: { flavor?: string },
): string | { error: string; help?: string; spans: [string, string, string] } {
  const [success, output, help, s_prefix, s_content, s_suffix] = compile(
    input,
    options?.flavor ?? 'js',
  )
  if (success) {
    return output
  } else {
    return {
      error: output,
      help,
      spans: [s_prefix, s_content, s_suffix],
    }
  }
}

function escapeHtml(html: string): string {
  return html.replace(/[<"&]/g, function (c) {
    return c === '<' ? '&lt;' : c === '"' ? '&quot;' : c === '&' ? '&amp;' : c
  })
}

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
    window.currentEditorContent = rulexEditor.getValue()

    const result = compileRulex(rulexEditor.getValue())
    if (typeof result === 'string') {
      regexEditorTarget.innerText = result

      editor.setModelMarkers(rulexEditor.getModel()!, '', [])
    } else {
      const lines1 = result.spans[0].split('\n')
      const lines2 = result.spans[1].split('\n')
      const last1 = lines1[lines1.length - 1] ?? ''
      const last2 = lines2[lines2.length - 1] ?? ''
      const start1 = last1.length + 1
      const start2 = lines2.length > 1 ? last2.length + 1 : last2.length + start1

      editor.setModelMarkers(rulexEditor.getModel()!, '', [
        {
          severity: MarkerSeverity.Error,
          startColumn: start1,
          startLineNumber: lines1.length,
          endColumn: start2,
          endLineNumber: lines1.length + lines2.length - 1,
          message: result.error + (result.help != null ? '\n\nHelp: ' + result.help : ''),
        },
      ])
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

  return (
    <div className={css.divs}>
      <div className={css.rulexPart}>
        <div
          style={{ height: 'calc(100vh - 60px)', width: '50vw' }}
          ref={(ref) => {
            if (ref != null) rulexEditorEl.current = ref
          }}
        />
      </div>
      <div className={css.regexPart}>
        <div
          ref={(ref) => {
            if (ref != null) regexEditorEl.current = ref
          }}
        />
      </div>
    </div>
  )
}
