import type { PomskyTest } from '@pomsky-lang/compiler-web'
import type { Diagnostic } from './pomskySupport'
import { createWorkerQueue } from '../utils/workerQueue'
import TestWorker from './pomskyTestWorker?worker'
import FindWorker from './pomskyFindWorker?worker'

export interface TestMessage {
  input: string
  output: string
  tests: PomskyTest[]
}

export interface FindMessage {
  regex: string
  haystack: string
  ignoreCase: boolean
  limit?: number
}

export const runTests = createWorkerQueue<TestMessage, Diagnostic[], string>(new TestWorker())

export const runSearch = createWorkerQueue<FindMessage, RegExpExecArray[], string>(new FindWorker())
