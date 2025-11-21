import { cli } from './cli.ts'

export interface VersionResult {
  clientVersion: string | undefined
  serverVersion: string | undefined
  serverPlatform: string | undefined
}

export async function version(): Promise<VersionResult> {
  const result = await cli`docker version --format=json`.json({ throw: false })

  return {
    clientVersion: result?.Client?.Version,
    serverVersion: result?.Server?.Version,
    serverPlatform:
      result?.Server?.Os && result.Server.Arch
        ? `${result.Server.Os}/${result.Server.Arch}`
        : undefined,
  }
}

export interface PullOptions {
  image: string
  policy?: 'missing' | 'always'
}

export async function pull({ image, policy = 'missing' }: PullOptions): Promise<void> {
  if (
    policy === 'missing' &&
    (await cli`docker image inspect --format=json ${image}`.json()).length > 0
  ) {
    return
  }

  await cli`docker image pull --quiet ${image}`.text()
}

export interface RunOptions {
  image: string
  container: string
  env: Record<Uppercase<string>, string>
  ports: string[]
}

export interface RunResult {
  containerId: string
}

export async function run({
  image,
  container: name,
  env: _env,
  ports: _ports,
}: RunOptions): Promise<RunResult> {
  const env = Object.entries(_env).reduce(
    (args, [k, v]) => [...args, `--env=${k}=${v}`],
    [] as string[]
  )
  const ports = _ports.map((port) => `--publish=${port}`)

  const containerId =
    await cli`docker container run ${{ name }} ${ports} ${env} --detach --tty --rm ${image}`.text()

  return {
    containerId,
  }
}

export interface KillOptions {
  container: string
}

export async function kill({ container }: KillOptions): Promise<void> {
  await cli`docker container kill ${container}`.text()
}
