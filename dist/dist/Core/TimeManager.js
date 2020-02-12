"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("./MongoDB");
class TimeManager {
    constructor(core) {
        core.on('ready', () => {
            if (!core.database.client)
                throw Error('Database client not init');
            this.database = core.database.client.collection('time');
            this.database.createIndex({ serverID: 1, timeStrap: 1 });
        });
    }
    async create(serverID, userID, timeStrap, type) {
        if (!this.database)
            throw MongoDB_1.ERR_DB_NOT_INIT;
        return (await this.database.insertOne({
            serverID,
            userID,
            timeStrap,
            type
        })).ops[0];
    }
    async get(serverID, startTime, endTime) {
        if (!this.database)
            throw MongoDB_1.ERR_DB_NOT_INIT;
        return this.database.find({ serverID, timeStrap: { $gte: startTime, $lt: endTime } }).toArray();
    }
    async getAll(serverID) {
        if (!this.database)
            throw MongoDB_1.ERR_DB_NOT_INIT;
        return this.database.find({ serverID }).toArray();
    }
}
exports.TimeManager = TimeManager;
//# sourceMappingURL=TimeManager.js.map