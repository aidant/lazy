import { test, expect } from 'vitest'
import { createPackage } from './context.ts'
import { useFactory } from '../provider.ts'
import { token } from '../token.ts'

test('a context is created and can be accessed', () => {
  const Database = token<{ query: () => {} }>()

  const context = createPackage({
    name: '',
    dependencies: {
      [Database]:
    }
  })
  const child = createPackage({
    parent: context,
    providers: {},
  })

  console.log(context, child)

  expect(context.database).toEqual(expect.objectContaining({ query: expect.any(Function) }))
  expect(context.database).toBe(context.database)
  expect(context[Database]).toBe(context.database)
  expect(child.database).toBe(context.database)
})
