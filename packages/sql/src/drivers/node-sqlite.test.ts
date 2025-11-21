import { expect, test } from 'vitest'
import { createSqliteConnection } from './node-sqlite.ts'
import { sql } from '../mod.ts'
import { DatabaseSync } from 'node:sqlite'

const db = createSqliteConnection(new DatabaseSync(':memory:'))

test('', async () => {
  const versions = await db.query(
    sql`select ${sql`json_object('sqlite', sqlite_version())`.as('versions').deserialize(JSON.parse)}`
  )
  expect(versions).toEqual([{ versions: { sqlite: expect.any(String) } }])
})
