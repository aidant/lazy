import { expect, test } from 'vitest'
import { getPort, isPortFree } from './port.ts'

test('it gets a random port number', async () => {
  await expect(getPort()).resolves.toEqual(expect.any(Number))
})

test('it returns true for a free port', async () => {
  await expect(isPortFree(await getPort())).resolves.toEqual(true)
})
