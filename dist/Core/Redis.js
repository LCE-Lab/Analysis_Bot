"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = exports.ERR_DB_NOT_INIT = void 0;
const events_1 = require("events");
const redis_1 = require("redis");
exports.ERR_DB_NOT_INIT = Error('Redis is not initialized');
class Redis extends events_1.EventEmitter {
    client;
    constructor(config) {
        super();
        const url = config.cache.host;
        this.client = (0, redis_1.createClient)({ url });
        this.client.on('ready', () => {
            console.log('[Redis] Connected successfully to server');
            this.emit('connect', this.client);
        });
        this.client.connect();
    }
}
exports.Redis = Redis;
//# sourceMappingURL=Redis.js.map