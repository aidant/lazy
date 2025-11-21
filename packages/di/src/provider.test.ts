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
import { run } from './context-provider.ts'

test('useFactory', () => {
  const value = crypto.randomUUID()
  const Factory = token<string>()
  const factory = () => value

  const injectionContext = init({
    with: {
      factory: useFactory(Factory, factory),
    },
  })

  expect(injectionContext.context.factory).toEqual(value)
  run(injectionContext, () => {
    expect(Factory()).toEqual(value)
  })
})

test('useFactoryWithContext', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()
  const Factory = token<string>()
  const factory = ({ value }: { value: string }) => value

  const injectionContext = init({
    with: {
      factoryWithContext: useFactoryWithContext(Factory, factory),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(injectionContext.context.factoryWithContext).toEqual(value)
  run(injectionContext, () => {
    expect(Factory()).toEqual(value)
  })
})

test('useFactoryWithArgs', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()
  const Factory = token<string>()
  const factory = (value: string) => value

  const injectionContext = init({
    with: {
      factoryWithArgs: useFactoryWithArgs(Factory, factory, [Value]),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(injectionContext.context.factoryWithArgs).toEqual(value)
  run(injectionContext, () => {
    expect(Factory()).toEqual(value)
  })
})

test('useValue', () => {
  const Value = token<string>()
  const value = crypto.randomUUID()

  const injectionContext = init({
    with: {
      value: useValue(Value, value),
    },
  })

  expect(injectionContext.context.value).toEqual(value)
  run(injectionContext, () => {
    expect(Value()).toEqual(value)
  })
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

  const injectionContext = init({
    with: {
      class: useClass(Class, ClassImpl),
    },
  })

  expect(injectionContext.context.class.value).toEqual(value)
  run(injectionContext, () => {
    expect(Class().value).toEqual(value)
  })
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

  const injectionContext = init({
    with: {
      classWithContext: useClassWithContext(Class, ClassImpl),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(injectionContext.context.classWithContext.value).toEqual(value)
  run(injectionContext, () => {
    expect(Class().value).toEqual(value)
  })
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

  const injectionContext = init({
    with: {
      classWithArgs: useClassWithArgs(Class, ClassImpl, [Value]),
    },
    parent: init({
      with: {
        value: useValue(Value, value),
      },
    }),
  })

  expect(injectionContext.context.classWithArgs.value).toEqual(value)
  run(injectionContext, () => {
    expect(Class().value).toEqual(value)
  })
})
