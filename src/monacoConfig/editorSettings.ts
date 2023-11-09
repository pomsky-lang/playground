import type { editor } from 'monaco-editor'

export const defaultEditorSettings: editor.IStandaloneEditorConstructionOptions = {
  theme: 'custom-dark',
  automaticLayout: true,
  minimap: { enabled: false },
  wordWrap: window.innerWidth > 1000 ? 'on' : 'off',
  wrappingIndent: 'indent',
  fontFamily: "'JetBrains Mono', monospace",
  fontLigatures: false,
  renderLineHighlight: 'all',
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
  fontSize: window.innerWidth > 900 ? 17 : window.innerWidth > 560 ? 16 : 15,
  lineNumbers: window.innerWidth > 900 ? 'on' : 'off',
  padding: { top: 6, bottom: 6 },
  wordBasedSuggestions: false,
  lineNumbersMinChars: 2,
}
