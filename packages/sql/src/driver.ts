import { postprocess, preprocess, type Connection, type Options } from './mod.ts'
import type { Sql } from './sql-classes/sql.ts'
import type { QueryInput } from './sql-classes/query-input.ts'

export type DynamicConnectionOptions<
  TConnectionOptions extends object,
  TConnection extends object,
> =
  | {
      connection: TConnection | (() => Promise<TConnection> | TConnection)
    }
  | {
      connectionOptions:
        | TConnectionOptions
        | (() => Promise<TConnectionOptions> | TConnectionOptions)
    }

export interface CreateDriverOptions<
  TConnectionOptions extends object,
  TConnection extends object,
> {
  options: Options
  fromOptions(options: TConnectionOptions): Promise<TConnection>
  query<T>(connection: TConnection, input: QueryInput): Promise<T[]>
  disconnect(connection: TConnection): Promise<void>
}

export function createDriver<TConnectionOptions extends object, TConnection extends object>(
  impl: CreateDriverOptions<TConnectionOptions, TConnection>
): (options: DynamicConnectionOptions<TConnectionOptions, TConnection>) => Connection {
  let connection: TConnection

  return (options: DynamicConnectionOptions<TConnectionOptions, TConnection>) => {
    return {
      async query(sql: Sql) {
        const input = preprocess(sql, impl.options)

        connection ||=
          'connection' in options
            ? typeof options.connection === 'function'
              ? await options.connection()
              : options.connection
            : await impl.fromOptions(
                typeof options.connectionOptions === 'function'
                  ? await options.connectionOptions()
                  : options.connectionOptions
              )

        const result = await impl.query(connection, input)

        if (result) {
          postprocess(sql, impl.options, result as readonly { [key: string]: unknown }[])
        }

        return result || []
      },
      async [Symbol.asyncDispose]() {
        await impl.disconnect(connection)
      },
    }
  }
}
