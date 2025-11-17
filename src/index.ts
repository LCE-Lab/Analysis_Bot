import { EventEmitter } from 'node:events'
import { readFileSync as readFile } from 'node:fs'
import type { CommandClient } from 'eris'
import { Bot } from './Component/Bot'
import { Web } from './Component/Web'
import { CacheManager } from './Core/CacheManager'
import type { Config } from './Core/Config'
import { MongoDB } from './Core/MongoDB'
import { Redis } from './Core/Redis'
import { SetManager } from './Core/SetManager'
import { TimeManager } from './Core/TimeManager'

export class Core extends EventEmitter {
  public readonly config: Config = JSON.parse(readFile('config.json', { encoding: 'utf-8' }))
  public readonly database = new MongoDB(this.config)
  public readonly cache = new Redis(this.config)
  public readonly _timeManager = new TimeManager(this)
  public readonly _cacheManager = new CacheManager(this)
  public readonly _setManager = new SetManager(this)
  public bot: CommandClient | null | undefined

  constructor() {
    super()

    this.emit('init', this)

    // Wait DB and Cache connect
    this.checkAll([this.database, this.cache]).then(() => {
      this.emit('ready')
    })

    this.on('ready', async () => {
      try {
        new Bot(this)
      } catch (error) {
        console.error(error)
      }
    })

    this.on('discordReady', () => {
      try {
        new Web(this)
      } catch (error) {
        console.error(error)
      }
    })
  }

  private waitEvent(event: EventEmitter) {
    return new Promise((resolve, rejects) => {
      event.on('connect', resolve)
      event.on('error', rejects)
    })
  }

  private async checkAll(process: EventEmitter[]) {
    const pending: Promise<unknown>[] = []

    process.forEach((element: EventEmitter) => {
      pending.push(this.waitEvent(element))
    })

    await Promise.all(pending)
  }
}

new Core()
