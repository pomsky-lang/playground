import { editor, languages } from 'monaco-editor'
import { addPrefColorSchemeListener } from '../hooks'
import { completionItems } from './completionItems'
import { languageConfiguration } from './languageConfiguration'
import { languageDefinition } from './languageDefinition'
import { CustomDarkTheme, CustomLightTheme } from './colorSchemes'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

export { defaultEditorSettings } from './editorSettings'

export function initMonaco() {
  window.MonacoEnvironment = {
    getWorker: () => new EditorWorker(),
  }

  languages.register({ id: 'pomsky' })
  languages.setMonarchTokensProvider('pomsky', languageDefinition)
  languages.setLanguageConfiguration('pomsky', languageConfiguration)
  languages.registerCompletionItemProvider('pomsky', completionItems)

  editor.defineTheme('custom-dark', CustomDarkTheme)
  editor.defineTheme('custom-light', CustomLightTheme)

  addPrefColorSchemeListener(({ preferDark }) => {
    editor.setTheme(preferDark ? 'custom-dark' : 'custom-light')
  })

  document.fonts.ready.then(() => {
    editor.remeasureFonts()
  })
}
