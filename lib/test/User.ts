import Entity from "../entity/entity";
import Repository from "../repository/repository";
import Schema from "../schema/schema";
import Client from "../client";
import { EntityOmx, Primary, Property } from "../ext/decorators";

export interface EGroupItem {
    name: string;
    score: number;
}

@EntityOmx('GroupItem', { isItem: true })
export class GroupItem implements EGroupItem {
    @Property({ type: 'string', indexed: true })
    name: string;

    @Property({ type: 'number', indexed: true })
    score: number;
}

export interface EUser {
    id: number;
    name: string;
    age: number;
    created: Date;
    dbs: string[];
    group: GroupItem;
}

@EntityOmx('User')
export class User extends Entity implements EUser {
    /** 用户uid */
    @Primary()
    @Property({ type: 'number', indexed: true })
    id: number;
    @Property({ type: 'text', indexed: true })
    name: string;

    @Property({ type: 'number', defaultValue: 100 })
    age: number;

    @Property({ type: 'date' })
    created: Date;

    @Property({ type: 'string[]' })
    dbs: string[];

    @Property({ type: 'object' })
    group: GroupItem;

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
        let user = await User.repository.createEntity(data as any);
        await User.repository.save(user);
        return user;
    }
}

export const createIndex = async () => await User.repository.createIndex();