import Entity from "../entity/entity";
import Repository from "../repository/repository";
import Schema from "../schema/schema";
import Client from "../client";
import { MetadataEntity, MetadataHasOne, MetadataPrimary, MetadataProperty } from "../ext/decorators";

export interface EGroupItem {
    groupName: string;
    score: number;
}

@MetadataEntity('GroupItem', { isItem: true })
export class GroupItem implements EGroupItem {
    @MetadataProperty({ type: 'string', indexed: true })
    groupName: string;

    @MetadataProperty({ type: 'number', indexed: true })
    score: number;
}

export interface EUser {
    id: number;
    name: string;
    age: number;
    created: Date;
    dbs: string[];
    // group: GroupItem;
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

    @MetadataProperty({ type: 'string[]', indexed: false })
    dbs: string[];

    // @MetadataHasOne(GroupItem)
    // @MetadataProperty({ type: 'object', indexed: false })
    // group: GroupItem;

    private static _repository: Repository<User>;

    static get repository() {
        if (!User._repository) {
            User._repository = (global.clientOM as Client).fetchRepository(new Schema(User))
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