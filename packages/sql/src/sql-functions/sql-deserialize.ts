import { reducer, Sql } from '../sql-classes/sql.ts'

declare module '../sql-classes/sql.ts' {
  interface Sql {
    deserialize: (deserializer: (value: any) => any) => Sql
  }
}

Sql.prototype.deserialize = function deserialize(
  deserializer: (value: any) => any
): Sql {
  return this[reducer]({ type: 'deserialize', payload: deserializer })
}
