import { test, expect } from 'vitest'
import { init, token, useValue, run } from './mod.ts'

test('di', () => {
  const Database = token<{ query: () => any }>('Database')

  const db = { query: () => {} }

  const injectionContext = init({
    with: {
      database: useValue(Database, db),
    },
  })

  expect(injectionContext.context.database).toEqual(db)

  expect(
    run(injectionContext, () => {
      const database = Database()

      expect(database).toEqual(db)
    })
  )
})
