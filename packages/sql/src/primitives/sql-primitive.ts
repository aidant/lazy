import type { SqlDialectName } from './sql-dialect-types.ts'
import { EMPTY_SQL, Sql } from './sql.ts'

export const toSql = Symbol.for('toSql')
export const fromRows = Symbol.for('fromRows')
export const getDeserializers = Symbol.for('getDeserializers')
export const reducer = Symbol.for('reducer')

export interface ToSqlContext {
  dialect: SqlDialectName
  values: Map<unknown, string>
}

type OneOf<Key extends string, Value> = { [K in Key]: Record<K, Value> }[Key]

export type SerializerFn = (value: unknown) => unknown
export type SerializerKey = 'serialize' | 'encode' | 'stringify'

export type DeserializerFn = (value: unknown) => unknown
export type DeserializerKey = 'deserialize' | 'decode' | 'parse'

export type Serializer = SerializerFn | OneOf<SerializerKey, SerializerFn>

export type Deserializer =
  | DeserializerFn
  | OneOf<DeserializerKey, DeserializerFn>

export type Serde = OneOf<SerializerKey, SerializerFn> &
  OneOf<DeserializerKey, DeserializerFn>

export type Deserializers = Map<
  readonly [string, ...string[]],
  readonly [DeserializerFn, ...DeserializerFn[]]
>

export type SqlMetaAction =
  | {
      type: 'bind'
      payload: Readonly<Record<string, unknown>>
    }
  | {
      type: 'serialize'
      payload: SerializerFn
    }
  | {
      type: 'deserialize'
      payload: DeserializerFn
    }

export class SqlPrimitive {
  bind(values: Readonly<Record<string, unknown>>): SqlPrimitive {
    return this[reducer]({ type: 'bind', payload: values })
  }

  serialize(serializer: Serializer): SqlPrimitive {
    return this[reducer]({
      type: 'serialize',
      payload:
        'serialize' in serializer
          ? serializer.serialize
          : 'encode' in serializer
            ? serializer.encode
            : 'stringify' in serializer
              ? serializer.stringify
              : serializer,
    })
  }

  deserialize(deserializer: Deserializer): SqlPrimitive {
    return this[reducer]({
      type: 'deserialize',
      payload:
        'deserialize' in deserializer
          ? deserializer.deserialize
          : 'decode' in deserializer
            ? deserializer.decode
            : 'parse' in deserializer
              ? deserializer.parse
              : deserializer,
    })
  }

  serde(serde: Serde): SqlPrimitive {
    return this[reducer]({
      type: 'serialize',
      payload:
        'serialize' in serde
          ? serde.serialize
          : 'encode' in serde
            ? serde.encode
            : 'stringify' in serde
              ? serde.stringify
              : serde,
    })[reducer]({
      type: 'deserialize',
      payload:
        'deserialize' in serde
          ? serde.deserialize
          : 'decode' in serde
            ? serde.decode
            : 'parse' in serde
              ? serde.parse
              : serde,
    })
  }

  [toSql](_context: ToSqlContext): Sql {
    return EMPTY_SQL
  }

  [fromRows](rows: Record<string, unknown>[]): void {
    const deserializers: Deserializers = new Map()
    this[getDeserializers](deserializers)
    for (const row of rows) {
      for (const _key of Object.keys(row)) {
      }
    }
  }

  [reducer](_action: SqlMetaAction): SqlPrimitive {
    return this
  }

  [getDeserializers](_deserializers: Deserializers): void {}

  [Symbol.for('nodejs.util.inspect.custom')](
    _depth: number,
    options: object,
    inspect: Function
  ) {
    const sql = this[toSql]({ dialect: 'sqlite', values: new Map() })
    if (!sql.text) delete (sql as any).text
    if (!sql.values) delete (sql as any).values
    return inspect(sql, options)
  }
}

export const EMPTY_SQL_PRIMITIVE = new SqlPrimitive()
