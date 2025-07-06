/// <reference types="node" />

import { setContextAsync, type Context } from '../context.ts'
import { AsyncLocalStorage } from 'node:async_hooks'

const contextAsync = new AsyncLocalStorage<Context>()

setContextAsync(() => contextAsync.getStore())

export async function run<Fn extends () => unknown>(
  context: Context,
  fn: Fn
): Promise<Awaited<ReturnType<Fn>>> {
  return (await contextAsync.run(context, fn)) as Awaited<ReturnType<Fn>>
}
