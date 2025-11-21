import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { cwd } from 'node:process'
import { text as _text } from 'node:stream/consumers'

export interface ChildProcess {
  ok(): Promise<boolean>
  text<T extends string>(options?: { throw?: boolean }): Promise<T>
  json<T extends unknown = any>(options?: { throw?: boolean }): Promise<T>
}

export function cli(
  strings: readonly string[],
  ...args: (string | string[] | Record<string, string>)[]
): ChildProcess
export function cli(...args: string[]): ChildProcess
export function cli(
  strings: string | readonly string[],
  ...values: (string | string[] | Record<string, string>)[]
): ChildProcess {
  const [command, args] =
    typeof strings === 'string'
      ? [strings, values as string[]]
      : strings.reduce(
          ([command, args], string, index) => {
            const segments = string.trim().split(' ')

            if (index === 0) {
              command = segments.shift() || ''
            }

            for (const segment of segments) {
              args.push(segment)
            }

            if (index < values.length) {
              const value = values[index]!

              if (Array.isArray(value)) {
                for (const arg of value) {
                  args.push(arg)
                }
              } else if (typeof value === 'object') {
                for (const [k, v] of Object.entries(value)) {
                  args.push(`--${k}=${v}`)
                }
              } else {
                args.push(value)
              }
            }

            return [command, args]
          },
          ['', [] as string[]]
        )

  const child = spawn(command!, args, { cwd: cwd(), stdio: ['pipe', 'pipe', 'pipe'] })

  const promise = Promise.all([
    _text(child.stdout),
    _text(child.stderr),
    once(child, 'exit').then(([code]) => code),
  ])

  const ok = async () => (await promise)[2] === 0
  const text = async <T extends string>(options?: { throw?: boolean }): Promise<T> => {
    const [stdout, stderr, code] = await promise

    if (code) {
      if (options?.throw === false) {
        return '' as T
      } else {
        throw new Error(stderr.trim().replace(/^Error:?\s*/i, ''))
      }
    }

    return stdout.trim() as T
  }
  const json = async (options?: { throw?: boolean }) =>
    JSON.parse((await text(options)) || 'null') ?? undefined

  return {
    ok,
    text,
    json,
  }
}
