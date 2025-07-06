import { test, expect } from 'vitest'
import { run } from './run-sync.ts'
import { createContext } from './context.ts'
import { useValue } from './provider.ts'
import { token } from './token.ts'
import { inject } from './inject.ts'

test('run-sync', () => {
  const Database = token<{}>('Database')
  const db = {}

  run(createContext({ with: [useValue(Database, db)] }), () => {
    expect(inject(Database)).toBe(db)
  })
})
