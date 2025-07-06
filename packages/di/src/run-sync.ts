import { setContext, type Context } from './context.ts'

export function run<Fn extends () => unknown>(
  context: Context,
  fn: Fn
): ReturnType<Fn> {
  const previousContext = setContext(context)
  try {
    return fn() as ReturnType<Fn>
  } finally {
    setContext(previousContext)
  }
}
