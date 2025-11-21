import { postprocess, preprocess, type Connection, type Sql } from '../mod.ts'
import type { Connection as SnowflakeConnection } from 'snowflake-sdk'
import { disconnect, connect, query } from './snowflake-utils.ts'

export function createSnowflakeConnection(connection: SnowflakeConnection): Connection {
  let isConnected = false

  return {
    async query(sql: Sql) {
      const options = { dialect: 'snowflake', parametersByName: false } as const
      const input = preprocess(sql, options)

      if (!isConnected) {
        await connect(connection)
        isConnected = true
      }

      const result = await query(connection, input)

      if (result) {
        postprocess(sql, options, result)
      }

      return result || []
    },
    async [Symbol.asyncDispose]() {
      await disconnect(connection)
    },
  }
}
