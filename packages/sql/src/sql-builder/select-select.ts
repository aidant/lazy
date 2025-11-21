import type { Sql } from '../sql-classes/sql.ts'
import { SelectStatement } from './select.ts'

export interface SelectOptions {}

declare module './select.ts' {
  interface SelectStatementState {
    select: SelectOptions | Sql
  }

  interface SelectStatement {
    select(options: SelectOptions | Sql): SelectStatement
  }
}

SelectStatement.prototype.select = function (
  options: SelectOptions | Sql
): SelectStatement {
  return new SelectStatement({ select: options }, this)
}

export function select(options: SelectOptions | Sql) {
  return new SelectStatement({ select: options })
}
