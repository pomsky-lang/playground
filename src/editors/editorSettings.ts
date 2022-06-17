import { editor } from 'monaco-editor'

export const defaultEditorSettings: editor.IStandaloneEditorConstructionOptions = {
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: { enabled: false },
  wordWrap: 'on',
  wrappingIndent: 'indent',
  fontFamily: "'JetBrains Mono', monospace",
  fontLigatures: false,
  renderLineHighlight: 'none',
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
  columnSelection: true,
  fontSize: 17,
}
