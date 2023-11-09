/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EditorConfigSettings } from './Editors'
import css from './EditorConfig.module.scss'

export interface EditorConfigProps {
  config: EditorConfigSettings
  setConfig(value: EditorConfigSettings): void
}

export function EditorConfig({ config, setConfig }: EditorConfigProps) {
  return (
    <>
      <div className={css.editorSetting}>
        Tab Size:
        <input
          type="number"
          value={config.tabSize}
          onChange={(e) => {
            const value = e.target.value
            if (!isNaN(+value)) {
              setConfig({ ...config, tabSize: +value })
            }
          }}
        />
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
      <div className={`${css.editorSetting} ${css.big}`}>
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
            setConfig({ ...config, wordWrap: e.target.value as any })
          }}
        >
          <option value="on">on</option>
          <option value="off">off</option>
        </select>
      </div>
      <div className={css.editorSetting}>
        Render Whitespace:
        <select
          value={config.renderWhitespace}
          onChange={(e) => {
            setConfig({ ...config, renderWhitespace: e.target.value as any })
          }}
        >
          <option value="none">none</option>
          <option value="boundary">boundary</option>
          <option value="selection">selection</option>
          <option value="trailing">trailing</option>
          <option value="all">all</option>
        </select>
      </div>
      <div className={css.editorSetting}>
        Cursor Style:
        <select
          value={config.cursorStyle}
          onChange={(e) => {
            setConfig({ ...config, cursorStyle: e.target.value as any })
          }}
        >
          <option value="line">line</option>
          <option value="block">block</option>
          <option value="underline">underline</option>
          <option value="line-thin">line-thin</option>
          <option value="block-outline">block-outline</option>
          <option value="underline-thin">underline-thin</option>
        </select>
      </div>
      <div className={css.editorSetting}>
        Multi-Cursor Modifier:
        <select
          value={config.multiCursorModifer}
          onChange={(e) => {
            setConfig({ ...config, multiCursorModifer: e.target.value as any })
          }}
        >
          <option value="alt">alt</option>
          <option value="ctrlCmd">ctrlCmd</option>
        </select>
      </div>
      <div className={css.editorSetting}>
        Insert Spaces:
        <input
          type="checkbox"
          checked={config.insertSpaces}
          onChange={(e) => setConfig({ ...config, insertSpaces: e.target.checked })}
        />
      </div>
      <div className={css.editorSetting}>
        Bracket Pair Colorization:
        <input
          type="checkbox"
          checked={config['bracketPairColorization.enabled']}
          onChange={(e) => {
            setConfig({ ...config, ['bracketPairColorization.enabled']: e.target.checked })
          }}
        />
      </div>
      <div className={css.editorSetting}>
        Minimap Enabled:
        <input
          type="checkbox"
          checked={config.minimap.enabled}
          onChange={(e) => {
            setConfig({ ...config, minimap: { ...config.minimap, enabled: e.target.checked } })
          }}
        />
      </div>
    </>
  )
}
