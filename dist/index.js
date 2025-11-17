"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const node_events_1 = require("node:events");
const node_fs_1 = require("node:fs");
const Bot_1 = require("./Component/Bot");
const Web_1 = require("./Component/Web");
const CacheManager_1 = require("./Core/CacheManager");
const MongoDB_1 = require("./Core/MongoDB");
const Redis_1 = require("./Core/Redis");
const SetManager_1 = require("./Core/SetManager");
const TimeManager_1 = require("./Core/TimeManager");
class Core extends node_events_1.EventEmitter {
    config = JSON.parse((0, node_fs_1.readFileSync)('config.json', { encoding: 'utf-8' }));
    database = new MongoDB_1.MongoDB(this.config);
    cache = new Redis_1.Redis(this.config);
    _timeManager = new TimeManager_1.TimeManager(this);
    _cacheManager = new CacheManager_1.CacheManager(this);
    _setManager = new SetManager_1.SetManager(this);
    bot;
    constructor() {
        super();
        this.emit('init', this);
        this.checkAll([this.database, this.cache]).then(() => {
            this.emit('ready');
        });
        this.on('ready', async () => {
            try {
                new Bot_1.Bot(this);
            }
            catch (error) {
                console.error(error);
            }
        });
        this.on('discordReady', () => {
            try {
                new Web_1.Web(this);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    waitEvent(event) {
        return new Promise((resolve, rejects) => {
            event.on('connect', resolve);
            event.on('error', rejects);
        });
    }
    async checkAll(process) {
        const pending = [];
        process.forEach((element) => {
            pending.push(this.waitEvent(element));
        });
        await Promise.all(pending);
    }
}
exports.Core = Core;
new Core();
//# sourceMappingURL=index.js.map