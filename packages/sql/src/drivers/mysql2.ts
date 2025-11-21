import type { ConnectionOptions, Connection, Pool, PoolOptions } from 'mysql2'
import { disconnect, query, fromOptions } from './mysql2-utils.ts'
import { createDriver } from '../driver.ts'

export const createConnection = createDriver<ConnectionOptions | PoolOptions, Connection | Pool>({
  options: { dialect: 'mysql', parametersByName: false },
  fromOptions,
  query,
  disconnect,
})
