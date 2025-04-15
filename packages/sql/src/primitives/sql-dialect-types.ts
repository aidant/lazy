export type SqlDialectName = 'sqlite' | 'mysql' | 'postgresql'

export const QUOTE = {
  sqlite: '"',
  mysql: '`',
  postgresql: '"',
} satisfies Record<SqlDialectName, string>

export const VARIABLE_PARAMETER_PREFIX = {
  sqlite: ':',
  mysql: '@',
  postgresql: '$',
} satisfies Record<SqlDialectName, string>

export const NUMERIC_PARAMETER_PREFIX = {
  sqlite: '?',
  mysql: '@n',
  postgresql: '$',
} satisfies Record<SqlDialectName, string>
