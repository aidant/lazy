import * as docker from '../_utils/docker.ts'
import { getPort } from '../_utils/port.ts'
import { password } from '../_utils/random.ts'
import {
  createConnection as createMysqlConnection,
  type Connection as MysqlConnection,
  type ConnectionOptions,
} from 'mysql2'
import { disconnect, connect, isReady } from './mysql2-utils.ts'
import { createConnection } from './mysql2.ts'
import { patch } from '../_utils/patch.ts'

async function getConnection(options: ConnectionOptions): Promise<MysqlConnection> {
  let connection: MysqlConnection | undefined
  do {
    try {
      connection = createMysqlConnection(options)
      await connect(connection)
      await isReady(connection)
    } catch (error) {
      if (connection) {
        void disconnect(connection)
        connection = undefined
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    }
  } while (!connection)
  return connection
}

async function testWithDocker() {
  const version = await docker.version()

  if (!version.serverVersion) {
    return
  }

  const image = 'mysql:9.4.8'
  const container = `lazy.${password()}`
  const MYSQL_ROOT_PASSWORD = password()
  const port = await getPort(3306)

  await docker.pull({ image })
  const { containerId } = await docker.run({
    image,
    container,
    env: {
      MYSQL_ROOT_PASSWORD,
    },
    ports: [`${port}:3306/tcp`],
  })
  const connection = await getConnection({ user: 'root', password: MYSQL_ROOT_PASSWORD, port })

  const db = createConnection(connection)

  patch(db, Symbol.asyncDispose, async (dispose) => {
    await dispose()
  })

  return db
}

export async function test() {
  const connection = await testWithDocker()

  if (connection) {
    return connection
  }
}
