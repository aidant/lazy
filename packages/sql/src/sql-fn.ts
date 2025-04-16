import type { Dialect } from './atomics/dialect.ts'
import { SqlDialect } from './atomics/sql-dialect.ts'
import { SqlFragments } from './atomics/sql-fragments.ts'
import { SqlIdentifier } from './atomics/sql-identifier.ts'
import { SqlText } from './atomics/sql-text.ts'
import { SqlValue } from './atomics/sql-value.ts'
import { Sql } from './atomics/sql.ts'

export function sql(strings: readonly string[], ...values: unknown[]): Sql {
  const fragments: Sql[] = []

  for (let index = 0; index < strings.length; index++) {
    const string = strings[index]!

    fragments.push(new SqlText(string))

    if (index >= values.length) {
      continue
    }

    let value = values[index]

    if (value instanceof Sql) {
      fragments.push(value)
    } else {
      fragments.push(new SqlValue(undefined, value))
    }
  }

  return new SqlFragments(fragments)
}

sql.raw = function raw(text: string): Sql {
  return new SqlText(text)
}

const JOIN_SEPARATOR = new Set([
  '',
  ' ',
  ',',
  ', ',
  ' and ',
  ' or ',
  ') and (',
  ') or (',
  ';',
  '; ',
])
export type JoinSeparator =
  typeof JOIN_SEPARATOR extends Set<infer T> ? T : never

sql.join = function join(
  fragments: Sql[],
  separator: Sql | JoinSeparator
): Sql {
  if (typeof separator === 'string' && !JOIN_SEPARATOR.has(separator)) {
    throw new Error(
      `Unable to join sql queries, the separator "${separator}" is not included in the list of allowed separators: "${[...JOIN_SEPARATOR].join('", "')}"`
    )
  }

  return new SqlFragments(fragments, separator)
}

sql.value = function value(value: unknown): Sql {
  return new SqlValue(undefined, value)
}

sql.values = function values(
  values: readonly unknown[] | Readonly<Record<string, unknown>>
): Sql {
  const fragments: Sql[] = []

  if (Array.isArray(values)) {
    for (const value of values) {
      fragments.push(new SqlValue(undefined, value))
    }
  } else {
    for (const key of Object.keys(values)) {
      const value = (values as Readonly<Record<string, unknown>>)[key]!
      fragments.push(
        new SqlFragments([
          new SqlIdentifier(key),
          new SqlText(' = '),
          new SqlValue(undefined, value),
        ])
      )
    }
  }

  return new SqlFragments(fragments, ', ')
}

sql.placeholder = function placeholder(placeholder: string): Sql {
  return new SqlValue(placeholder, undefined)
}

sql.placeholders = function placeholders(
  placeholders: readonly [string, ...string[]]
): Sql {
  const fragments: Sql[] = []
  for (const placeholder of placeholders) {
    fragments.push(new SqlValue(placeholder, undefined))
  }
  return new SqlFragments(fragments, ', ')
}

sql.identifier = function identifier(
  identifier: string | readonly [string, ...string[]]
): Sql {
  return new SqlIdentifier(identifier)
}

sql.dialect = function dialect(dialects: Readonly<Record<Dialect, Sql>>): Sql {
  return new SqlDialect(dialects)
}

sql.fn = new Proxy({} as Record<string, (...args: unknown[]) => Sql>, {
  get:
    (_target, property, _receiver) =>
    (...args: unknown[]) => {
      const fragments: Sql[] = [new SqlText(String(property)), new SqlText('(')]

      if (args.length) {
        const params: Sql[] = []

        for (const arg of args) {
          params.push(arg instanceof Sql ? arg : new SqlValue(undefined, arg))
        }

        fragments.push(new SqlFragments(params, ', '))
      }

      fragments.push(new SqlText(')'))

      return new SqlFragments(fragments)
    },
})
