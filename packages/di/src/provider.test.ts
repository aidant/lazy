import { test, expect } from 'vitest'
import {
  useClass,
  useClassWithArgs,
  useClassWithContext,
  useFactory,
  useFactoryWithArgs,
  useFactoryWithContext,
  useValue,
} from './provider.ts'
import { init } from './init.ts'
import { token } from './token.ts'

test('useFactory', () => {
  const value = crypto.randomUUID()
  const Factory = token<string>()
  const factory = () => value

  const { context } = init({
    with: {
      factory: useFactory(Factory, factory),
    },
  })

  expect(context.factory).toEqual(value)
})

test('useFactoryWithContext', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()
  const Factory = token<string>()
  const factory = ({ value }: { value: string }) => value

  const { context } = init({
    with: {
      factoryWithContext: useFactoryWithContext(Factory, factory),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(context.factoryWithContext).toEqual(value)
})

test('useFactoryWithArgs', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()
  const Factory = token<string>()
  const factory = (value: string) => value

  const { context } = init({
    with: {
      factoryWithArgs: useFactoryWithArgs(Factory, factory, [Value]),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(context.factoryWithArgs).toEqual(value)
})

test('useValue', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()

  const { context } = init({
    with: {
      value: useValue(Value, value),
    },
  })

  expect(context.value).toEqual(value)
})

test('useClass', () => {
  const value = crypto.randomUUID()
  const Class = token<{ value: string }>()
  class ClassImpl {
    value: string

    constructor() {
      this.value = value
    }
  }

  const { context } = init({
    with: {
      class: useClass(Class, ClassImpl),
    },
  })

  expect(context.class.value).toEqual(value)
})

test('useClassWithContext', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()
  const Class = token<{ value: string }>()
  class ClassImpl {
    value: string

    constructor({ value }: { value: string }) {
      this.value = value
    }
  }

  const { context } = init({
    with: {
      classWithContext: useClassWithContext(Class, ClassImpl),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(context.classWithContext.value).toEqual(value)
})

test('useFactoryWithArgs', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()
  const Class = token<{ value: string }>()
  class ClassImpl {
    value: string

    constructor(value: string) {
      this.value = value
    }
  }

  const { context } = init({
    with: {
      classWithArgs: useClassWithArgs(Class, ClassImpl, [Value]),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(context.classWithArgs.value).toEqual(value)
})
