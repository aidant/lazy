import type { Connection, ConnectionOptions, Pool, PoolOptions } from 'mysql2'
import { asPromise } from '../_utils/callback.ts'
import type { QueryInput } from '../mod.ts'

export type Mysql2ConnectionOptions = ConnectionOptions | PoolOptions
export type Mysql2Connection = Connection | Pool

export async function fromOptions(options: Mysql2ConnectionOptions): Promise<Mysql2Connection> {
  const { createConnection, createPool } = await import('mysql2')

  if (
    typeof options.waitForConnections !== 'undefined' ||
    typeof options.connectionLimit !== 'undefined' ||
    typeof options.maxIdle !== 'undefined' ||
    typeof options.idleTimeout !== 'undefined' ||
    typeof options.queueLimit !== 'undefined'
  ) {
    return createPool(options)
  }

  return createConnection(options)
}

export async function isReady(
  connection: Pick<Connection, 'ping' | 'query'> | Pick<Pool, 'query'>
): Promise<boolean> {
  try {
    if ('ping' in connection) {
      await asPromise<void>(connection.ping, connection)
    }
    await query(connection, { text: 'select 1' })
    return true
  } catch {
    return false
  }
}

export async function query<T extends unknown[]>(
  connection: Pick<Mysql2Connection, 'query'>,
  query: Pick<QueryInput, 'text' | 'parametersByPosition'>
): Promise<T> {
  return await asPromise<T>((callback) =>
    connection.query(
      {
        sql: query.text,
        values: query.parametersByPosition,
        namedPlaceholders: false,
        typeCast: true,
        rowsAsArray: false,
      },
      callback
    )
  )
}

export async function disconnect(connection: Pick<Mysql2Connection, 'end'>): Promise<void> {
  await asPromise(connection.end, connection)
}
