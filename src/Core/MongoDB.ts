import { EventEmitter } from 'node:events'
import { type Db, MongoClient } from 'mongodb'
import type { Config } from './Config'

export const ERR_DB_NOT_INIT = Error('MongoDB is not initialized')

export declare interface MongoDB {
  on(event: 'connect', listen: (database: Db) => void): this
}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: Event typing
export class MongoDB extends EventEmitter {
  public client?: Db

  constructor(config: Config) {
    super()

    const dbConfig = config.database

    const client = new MongoClient(dbConfig.host)

    client.connect().then(() => {
      console.log('[MongoDB] Connected successfully to server')

      this.client = client.db(dbConfig.name)

      this.emit('connect', this.client)
    })
  }
}
