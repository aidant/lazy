import { reducer, Sql } from '../sql-classes/sql.ts'

declare module '../sql-classes/sql.ts' {
  interface Sql {
    bind(values: { readonly [name: string]: unknown }): Sql
  }
}

Sql.prototype.bind = function bind(values: {
  readonly [name: string]: unknown
}): Sql {
  return this[reducer]({ type: 'bind', payload: values })
}
