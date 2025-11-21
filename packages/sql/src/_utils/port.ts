import { createServer } from 'node:net'

async function bind(port?: number) {
  const server = createServer()

  const promise = new Promise<number | undefined>((resolve, reject) => {
    function handleError(error: unknown) {
      server.off('error', handleError)
      server.off('listening', handleListening)
      server.close(() => {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
          resolve(undefined)
        } else {
          reject(error)
        }
      })
    }

    function handleListening() {
      server.off('error', handleError)
      server.off('listening', handleListening)

      const address = server.address()

      server.close(() => {
        resolve((typeof address === 'string' ? undefined : address?.port) ?? undefined)
      })
    }

    server.on('error', handleError)
    server.on('listening', handleListening)
  })

  server.listen({ port, exclusive: true, reusePort: false })

  return promise
}

export async function isPortFree(port: number): Promise<boolean> {
  return (await bind(port)) === port
}

export async function getPort(port?: number): Promise<number> {
  return (await bind(port)) || (await bind())!
}
