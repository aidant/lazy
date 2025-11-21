export function asPromise<T>(
  fn?: (callback: (error: any, result: T) => void) => void,
  thisArg?: any
) {
  const { promise, resolve, reject } = Promise.withResolvers<T>()

  function callback(error: any, result: T) {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  }

  fn?.call(thisArg, callback)

  return { then: promise.then.bind(promise), promise, callback }
}
