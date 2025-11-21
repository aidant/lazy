import type { DatabaseSync, SQLInputValue, SQLOutputValue } from 'node:sqlite'
import type { QueryInput } from '../sql-classes/query-input.ts'

export async function query(
  connection: Pick<DatabaseSync, 'prepare'>,
  query: QueryInput
): Promise<Record<string, SQLOutputValue>[]> {
  const statement = connection.prepare(query.text)

  if (statement.columns().length) {
    const result = statement.all(
      (query.parametersByName || {}) as Record<string, SQLInputValue>,
      ...((query.parametersByPosition || []) as SQLInputValue[])
    )

    return result
  } else {
    statement.run(
      (query.parametersByName || {}) as Record<string, SQLInputValue>,
      ...((query.parametersByPosition || []) as SQLInputValue[])
    )

    return []
  }
}
