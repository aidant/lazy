export type Dialect = 'mysql' | 'postgres' | 'snowflake' | 'sqlite'

export const IdentifierQuote = {
  mysql: '`',
  postgres: '"',
  snowflake: '"',
  sqlite: '"',
} as const satisfies { [TDialect in Dialect]: string }

export const ParameterPositional = {
  mysql: '?',
  postgres: '$',
  snowflake: '?',
  sqlite: '?',
} as const satisfies { [TDialect in Dialect]: string }

export const ParameterNamePrefix = {
  mysql: '@',
  postgres: undefined,
  snowflake: ':',
  sqlite: ':',
} as const satisfies { [TDialect in Dialect]: string | undefined }
