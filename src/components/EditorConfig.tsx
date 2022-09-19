import { EditorConfigSettings } from './Editors'
import css from './EditorConfig.module.scss'

export interface EditorConfigProps {
  config: EditorConfigSettings
  setConfig(value: EditorConfigSettings): void
}

export function EditorConfig({ config, setConfig }: EditorConfigProps) {
  return (
    <>
      <div className={css.editorSetting}>
        Indentation:
        <select
          value={config.tabSize}
          onChange={(e) => {
            const value = e.target.value
            if (!isNaN(+value)) {
              setConfig({ ...config, tabSize: +value })
            }
          }}
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
        </select>
      </div>
      <div className={css.editorSetting}>
        Font size:
        <input
          type="number"
          value={config.fontSize}
          onChange={(e) => {
            const value = e.target.value
            if (!isNaN(+value)) {
              setConfig({ ...config, fontSize: +value })
            }
          }}
        />
      </div>
      <div className={css.editorSetting}>
        Font family:
        <input
          type="text"
          value={config.fontFamily}
          onChange={(e) => {
            setConfig({ ...config, fontFamily: e.target.value })
          }}
        />
      </div>
      <div className={css.editorSetting}>
        Word wrap:
        <select
          value={config.wordWrap}
          onChange={(e) => {
            setConfig({ ...config, wordWrap: e.target.value as 'on' | 'off' })
          }}
        >
          <option value="on">on</option>
          <option value="off">off</option>
        </select>
      </div>
    </>
  )
}
