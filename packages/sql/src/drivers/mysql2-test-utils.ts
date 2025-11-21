import type { Mysql2Connection } from './mysql2-utils.ts'
import { disconnect as _disconnect, query as _query } from './mysql2-utils.ts'
import * as docker from '../_utils/docker.ts'
import type { QueryInput } from '../sql-classes/query-input.ts'

export interface Mysql2TestConnection {
  containerId?: string
  connection: Mysql2Connection
}

export async function fromOptions() {}

export async function query(
  connection: Mysql2TestConnection,
  query: Pick<QueryInput, 'text' | 'parametersByPosition'>
) {
  return await _query(connection.connection, query)
}

export async function disconnect(connection: Mysql2TestConnection): Promise<void> {
  await _disconnect(connection.connection)

  if ('containerId' in connection) {
    await docker.kill({ container: connection.containerId })
  }
}
