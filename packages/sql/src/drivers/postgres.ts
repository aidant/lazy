import { postprocess, preprocess, type Connection, type Sql } from '../mod.ts'
import { Client } from 'pg'

export function createPostgresConnection(client: Client): Connection {
  let isConnected = false

  return {
    async query(sql: Sql) {
      const options = { dialect: 'postgres' } as const
      const query = preprocess(sql, options)

      if (!isConnected) {
        await client.connect()
        isConnected = true
      }

      const result = await client.query({
        text: query.text,
        values: (query.parametersByPosition as unknown[] | undefined) || [],
      })

      postprocess(sql, options, result.rows)

      return result.rows
    },
    async [Symbol.asyncDispose]() {
      await new Promise<void>((resolve, reject) => {
        client.end((error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    },
  }
}
