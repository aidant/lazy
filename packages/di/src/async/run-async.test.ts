import { test, expect } from 'vitest'
import { run } from './run-async.ts'
import { createContext } from '../context.ts'
import { useValue } from '../provider.ts'
import { token } from '../token.ts'
import { inject } from '../inject.ts'

test('run-async', () => {
  const Database = token<{}>('Database')
  const db = {}

  run(createContext({ with: [useValue(Database, db)] }), async () => {
    await new Promise<void>((resolve) => queueMicrotask(resolve))

    expect(inject(Database)).toBe(db)
  })
})
