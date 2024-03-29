import { EventEmitter } from 'events';
import { RedisClientType, createClient } from 'redis';
import { Config } from './Config';

export const ERR_DB_NOT_INIT = Error('Redis is not initialized');

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export declare interface Redis {
    // eslint-disable-next-line no-unused-vars
    on(event: 'connect', listen: () => void): this;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Redis extends EventEmitter {
    public client: RedisClientType;

    constructor(config: Config) {
        super();

        const url = config.cache.host;

        this.client = createClient({ url });

        this.client.on('ready', () => {
            console.log('[Redis] Connected successfully to server');

            this.emit('connect', this.client);
        });

        this.client.connect();
    }
}
