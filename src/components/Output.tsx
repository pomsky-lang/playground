import { useEffect, useState } from 'react'
import { highlight } from '../editors/highlight'
import { CompileResult } from '../editors/rulexSupport'
import { Flavor, flavors } from './Editors'
import { ErrorMessage } from './ErrorMessage'
import { MatchText } from './MatchText'
import css from './Output.module.scss'
import { Tabbar } from './Tabbar'

interface Args {
  result: CompileResult
  flavor: Flavor
  onFlavorChange(flavor: Flavor): void
}

const flavorMap: Record<Flavor, string> = {
  js: 'JavaScript',
  java: 'Java',
  pcre: 'PCRE',
  ruby: 'Ruby',
  python: 'Python',
  rust: 'Rust',
  dotnet: '.NET',
}

export function Output({ result, flavor, onFlavorChange }: Args) {
  const [cached, setCached] = useState('')
  const [tab, setTab] = useState<'output' | 'match'>('output')

  useEffect(() => {
    if (typeof result === 'string') {
      setCached(result)
    }
  }, [result])

  const matchIsDisabled = typeof result !== 'string' || flavor !== 'js'
  const selectedTab = tab === 'output' || matchIsDisabled ? 'output' : 'match'

  return (
    <>
      <Tabbar
        tabs={{
          output: { name: 'Output' },
          match: {
            name: 'Find & Replace',
            disabled: matchIsDisabled,
            title: flavor === 'js' ? undefined : 'Only available in the JavaScript flavor',
          },
        }}
        selected={selectedTab}
        onSelect={(key) => setTab(key)}
      />

      {selectedTab === 'output' ? (
        <>
          <div className={css.flavors}>
            {flavors.map((f) => (
              <button
                key={f}
                className={f === flavor ? css.active : ''}
                onClick={() => onFlavorChange(f)}
              >
                {flavorMap[f]}
              </button>
            ))}
          </div>
          <ErrorMessage result={result} />
          <div className={css.regex} tabIndex={0}>
            {highlight(cached, 'regex')}
          </div>
        </>
      ) : (
        <MatchText regex={cached} />
      )}
    </>
  )
}
