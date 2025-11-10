import { editor } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import { defaultEditorSettings } from '../monacoConfig'
import { err } from '../utils/err'
import { currentPrefColorScheme } from './useColorScheme'

export function useMonacoEditor(value: string, setValue: (v: string) => void) {
  const editorElem = useRef<HTMLElement>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
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
      const elem =
        editorElem.current ?? err('editorElem not defined even though shouldInitialize is set')
      editorRef.current = createEditor(elem, value, setValue)
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
