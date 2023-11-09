export interface WorkerJob<In, Out, Err = string> {
  input: In
  resolve(output: Out): void
  reject(error: Rejection<Err>): void
  scheduled: boolean
}

export type WorkerResult<Out, Err> = { output: Out } | { error: Err }

export type Rejection<Err> = 'cancel' | { error: Err }

export function createWorkerQueue<In, Out, Err>(worker: Worker) {
  const jobQueue: WorkerJob<In, Out, Err>[] = []

  async function postMessage(input: In): Promise<Out> {
    return new Promise((resolve, reject) => {
      // cancel not yet started jobs
      while (jobQueue.length > 0 && !jobQueue[jobQueue.length - 1].scheduled) {
        const job = jobQueue.pop()
        job?.reject('cancel')
      }

      jobQueue.push({ input, resolve, reject, scheduled: false })
      schedule()
    })
  }

  function schedule() {
    const job = jobQueue[0]
    if (job && !job.scheduled) {
      job.scheduled = true
      worker.postMessage(job.input)
    }
  }

  worker.addEventListener('message', ({ data }: MessageEvent<WorkerResult<Out, Err>>) => {
    const { resolve, reject } = jobQueue.shift()!
    if ('output' in data) {
      resolve(data.output)
    } else {
      reject(data)
    }
    schedule()
  })

  return postMessage
}
