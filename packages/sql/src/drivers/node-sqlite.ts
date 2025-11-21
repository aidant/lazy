import type { DatabaseSync } from 'node:sqlite'
import { type Sql, type Connection, preprocess, postprocess } from '../mod.ts'

export function createSqliteConnection(database: DatabaseSync): Connection {
  return {
    async query(sql: Sql) {
      const options = { dialect: 'sqlite' } as const
      const query = preprocess(sql, options)
      const statement = database.prepare(query.text)

      if (statement.columns().length) {
        const result = statement.all(
          (query.parametersByName || {}) as Record<string, any>,
          ...((query.parametersByPosition || []) as any[])
        )

        postprocess(sql, options, result)

        return result
      } else {
        statement.run(
          (query.parametersByName || {}) as Record<string, any>,
          ...((query.parametersByPosition || []) as any[])
        )

        return []
      }
    },
    async [Symbol.asyncDispose]() {
      database.close()
    },
  }
}
