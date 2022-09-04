import { editor } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import { defaultEditorSettings } from '../monacoConfig'
import { currentPrefColorScheme } from './useColorScheme'

export function useMonacoEditor(value: string, setValue: (v: string) => void) {
  const editorElem = useRef<HTMLElement>()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [shouldInitialize, setShouldInitialize] = useState(false)

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
      editorRef.current = createEditor(editorElem.current!, value, setValue)
    }
  }, [shouldInitialize])

  return [editorElem, editorRef] as const
}

function createEditor(
  editorTarget: HTMLElement,
  value: string,
  setValue: (v: string) => void,
): editor.IStandaloneCodeEditor {
  const pomskyEditor = editor.create(editorTarget, {
    ...defaultEditorSettings,
    value,
    language: 'pomsky',
    theme: currentPrefColorScheme().preferDark ? 'custom-dark' : 'custom-light',
  })

  const lines = value.split('\n')
  const lineNumber = lines.length
  const lastLine = lines[lines.length - 1]
  const column = lastLine.length + 1

  pomskyEditor.setPosition({ lineNumber, column })
  pomskyEditor.focus()
  pomskyEditor.revealLineInCenter(lineNumber)

  const syncEditors = () => {
    setValue(pomskyEditor.getValue())
  }

  syncEditors()

  pomskyEditor.getModel()?.onDidChangeContent(syncEditors)

  return pomskyEditor
}
