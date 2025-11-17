import { EventEmitter } from 'node:events'
import { createClient, type RedisClientType } from 'redis'
import type { Config } from './Config'

export const ERR_DB_NOT_INIT = Error('Redis is not initialized')

export declare interface Redis {
  on(event: 'connect', listen: () => void): this
}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: Event typing
export class Redis extends EventEmitter {
  public client: RedisClientType

  constructor(config: Config) {
    super()

    const url = config.cache.host

    this.client = createClient({ url })

    this.client.on('ready', () => {
      console.log('[Redis] Connected successfully to server')

      this.emit('connect', this.client)
    })

    this.client.connect()
  }
}
