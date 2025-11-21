import type { Bind, Connection, ConnectionOptions } from 'snowflake-sdk'
import { asPromise } from '../_utils/callback.ts'

export async function fromOptions(options: ConnectionOptions): Promise<Connection> {
  const {
    default: { createConnection, createPool },
  } = (await import('snowflake-sdk')) as object as { default: typeof import('snowflake-sdk') }

  const connection = createConnection(options)

  if (
    options.authenticator === 'EXTERNALBROWSER' ||
    options.authenticator?.startsWith('https://')
  ) {
    await asPromise(connection.connectAsync, connection)
  } else {
    await asPromise(connection.connect, connection)
  }

  return connection
}

export async function isReady(connection: Pick<Connection, 'isValidAsync'>): Promise<boolean> {
  try {
    return await connection.isValidAsync()
  } catch {
    return false
  }
}

export async function query<T extends any[] | undefined>(
  connection: Pick<Connection, 'execute'>,
  query: { readonly text: string; readonly parametersByPosision?: readonly unknown[] }
): Promise<T> {
  return await asPromise<T>((callback) => {
    connection.execute({
      sqlText: query.text,
      binds: query.parametersByPosision as Bind[],
      complete: (error, _, rows) => callback(error, rows as T),
    })
  })
}

export async function disconnect(connection: Pick<Connection, 'destroy'>): Promise<void> {
  await asPromise(connection.destroy, connection)
}
