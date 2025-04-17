export type Dialect = 'mysql' | 'postgres' | 'sqlite'

export const Quote = {
  mysql: '`',
  postgres: '"',
  sqlite: '"',
} as const satisfies { [TDialect in Dialect]: string }

export const ParameterPositional = {
  mysql: '?',
  postgres: '$',
  sqlite: '?',
} as const satisfies { [TDialect in Dialect]: string }

export const ParameterNamePrefix = {
  mysql: '@',
  postgres: undefined,
  sqlite: ':',
} as const satisfies { [TDialect in Dialect]: string | undefined }
