import { useContext, useEffect, useState } from 'react'
import { init, compilePomsky, type CompileResult } from '../editors/pomskySupport'
import { AppContext } from '../components/App'
import type { Rejection } from '../utils/workerQueue'
import { MarkerSeverity } from 'monaco-editor'
import { convertRange } from '../editors/convertRange'

export const flavors = ['js', 'java', 'pcre', 'ruby', 'python', 'rust', 'dotnet', 're2'] as const
export type Flavor = (typeof flavors)[number]

export function useCompilationResult(editorValue: string, flavor: Flavor) {
  const [wasmInit, setWasmInit] = useState(false)
  const [result, setResult] = useState<CompileResult>({ input: editorValue, output: '' })
  const { setIsTesting } = useContext(AppContext)

  useEffect(() => {
    if (!wasmInit) {
      init().then(() => {
        setWasmInit(true)
        setResult(compilePomsky(editorValue, { flavor, runTests: true }))
      })
    } else {
      setResult(compilePomsky(editorValue, { flavor, runTests: true }))
    }
  }, [editorValue, flavor])

  useEffect(() => {
    if (result.testDiagnostics) {
      setIsTesting(true)

      result.testDiagnostics
        .then((testDiagnostics) => {
          setIsTesting(false)

          setResult((currResult) => {
            if (currResult.input !== result.input) {
              // diagnostics are already out of date!
              return currResult
            }
            return {
              ...result,
              diagnostics: [...(result.diagnostics ?? []), ...testDiagnostics],
              testDiagnostics: undefined,
            }
          })
        })
        .catch((error: Rejection<string>) => {
          if (error === 'cancel') return

          setIsTesting(false)

          setResult((currResult) => {
            if (currResult.input !== result.input) {
              // diagnostics are already out of date!
              return currResult
            }
            return {
              ...result,
              diagnostics: [
                {
                  severity: MarkerSeverity.Error,
                  ...convertRange(result.input, [0, result.input.length]),
                  message: `Error running tests: ${error.error}`,
                  title: 'Error running tests',
                  code: 'test',
                },
              ],
              testDiagnostics: undefined,
            }
          })
        })
    }
  }, [result])

  return result
}
