import Entity from "../entity/entity";
import Repository from "../repository/repository";
import Schema from "../schema/schema";
import * as redis from 'redis';
import Client from "../client";
import { MetadataEntity, MetadataHasOne, MetadataPrimary, MetadataProperty } from "../ext/decorators";

@MetadataEntity('GroupItem', { isItem: true })
export class GroupItem {
    @MetadataProperty({ type: 'string', indexed: true })
    public readonly name: string;

    @MetadataProperty({ type: 'number', indexed: true })
    public readonly score: number;

    constructor(
        name: string,
        score: number
    ) {
        this.name = name;
        this.score = score;
    }
}

export interface EUser {
    id: number;
    name: string;
    age: number;
    created: Date;
    group: GroupItem;
}

@MetadataEntity('User')
export class User extends Entity implements EUser {
    /** 用户uid */
    @MetadataPrimary()
    @MetadataProperty({ type: 'number', indexed: true })
    id: number;
    @MetadataProperty({ type: 'string', indexed: true, sortable: false })
    name: string;

    @MetadataProperty({ type: 'number', defaultValue: 100 })
    age: number;

    @MetadataProperty({ type: 'date', indexed: false })
    created: Date;

    @MetadataHasOne(GroupItem)
    @MetadataProperty({ type: 'object', indexed: false })
    group: GroupItem;

    private static _repository: Repository<User>;

    static get repository() {
        if (!User._repository) {
            User._repository = (global.clientOM as Client).fetchRepository(new Schema(User, {
                id: { type: 'number' },
                name: { type: 'string' },
                age: { type: 'number' },
                created: { type: 'date' },
                group: { type: 'object' },
            }))
        }
        return User._repository;
    }

    /** 创建新用户 */
    static async create(data: EUser) {
        data.created = data.created || new Date();
        let user = User.repository.createEntity(data as any);
        await User.repository.save(user);
        return user;
    }
}

export const createIndex = async () => await User.repository.createIndex();