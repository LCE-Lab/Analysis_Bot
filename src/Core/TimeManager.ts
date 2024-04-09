import { Collection, ObjectId } from 'mongodb';
import { Core } from '..';
import { ERR_DB_NOT_INIT } from './MongoDB';

export interface ITime {
    _id: ObjectId;
    serverID: string;
    userID: string;
    timeStamp: number;
    type: string;
}

export class TimeManager {
    private database?: Collection<ITime>;

    constructor(core: Core) {
        core.on('ready', () => {
            if (!core.database.client) throw Error('Database client not init');

            this.database = core.database.client.collection('time');
            this.database.createIndex({ serverID: 1, timeStamp: 1 });
        });
    }

    public async create(serverID: string, userID: string, timeStamp: number, type: string) {
        if (!this.database) throw ERR_DB_NOT_INIT;

        const data = {
            serverID,
            userID,
            timeStamp,
            type
        } as ITime;

        return (await this.database.insertOne(data)).acknowledged ? data : null;
    }

    public async get(serverID: string, startTime: number, endTime: number) {
        if (!this.database) throw ERR_DB_NOT_INIT;

        return this.database.find({ serverID, timeStamp: { $gte: startTime, $lt: endTime } }).sort({ timeStamp: 1 }).toArray();
    }

    public async getByUser(serverID: string, userID: string, startTime: number, endTime: number) {
        if (!this.database) throw ERR_DB_NOT_INIT;

        return this.database.find({ serverID, userID, timeStamp: { $gte: startTime, $lt: endTime } }).sort({ timeStamp: 1 }).toArray();
    }

    public async getLastDataByUser(serverID: string, userID: string, priorTo: number) {
        if (!this.database) throw ERR_DB_NOT_INIT;

        return this.database.find({ serverID, userID, timeStamp: { $lt: priorTo } }).sort({ timeStamp: -1 }).limit(1).toArray();
    }

    public async getDataByKeyword(keyword: string) {
        if (!this.database) throw ERR_DB_NOT_INIT;

        return this.database.distinct(keyword);
    }

    public async getCountByUserAndType(serverID: string, userID: string, startTime: number, endTime: number, type: string) {
        if (!this.database) throw ERR_DB_NOT_INIT;

        return this.database.countDocuments({ serverID, userID, timeStamp: { $gte: startTime, $lt: endTime }, type });
    }
}
