/// <reference types="node" />

import { DatabaseSync } from 'node:sqlite'
import { type Sql, type Connection, preprocess } from '@lazy/sql'

export function createConnection(
  ...args: ConstructorParameters<typeof DatabaseSync>
): Connection {
  const database = new DatabaseSync(...args)

  const sqlite: Connection = async (sql: Sql) => {
    const { text, values: _values } = preprocess(sql, { dialect: 'sqlite' })
    database.prepare(text)
  }

  sqlite[Symbol.asyncDispose] = async () => {
    database.close()
  }

  return sqlite
}
