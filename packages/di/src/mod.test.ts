import { test, expect } from 'vitest'
import { createScope, dependency, run, inject } from './mod.ts'

test('scope get dependency by name', () => {
  const db = { query: () => {} }
  const Database = dependency('Database', () => db)
  const scope = createScope({ with: { db: Database } })

  expect(scope.db).toEqual(scope.db)
  expect(scope.db).toEqual({
    query: expect.any(Function),
  })
})

test('scope get dependency by reference', () => {
  const db = { query: () => {} }
  const Database = dependency('Database', () => db)
  const scope = createScope({ with: { db: Database } })

  expect(scope(Database)).toEqual(scope(Database))
  expect(scope(Database)).toEqual({
    query: expect.any(Function),
  })
})

test('run in scope', () => {
  const db = { query: () => {} }
  const Database = dependency('Database', () => db)
  const scope = createScope({ with: { db: Database } })

  run(scope, () => {
    expect(inject(Database)).toEqual(inject(Database))
    expect(inject(Database)).toEqual({
      query: expect.any(Function),
    })
  })
})
