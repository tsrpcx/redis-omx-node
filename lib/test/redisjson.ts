import { Type } from '../ext/metadata/type';
import { Metadata } from '../ext/metadata/metadata';
import { PropertyMetadata } from '../ext/metadata/property.metadata';
import { Condition } from '../ext/interfaces/condition';
import { OrderBy } from '../ext/interfaces/orderby';
import { WhereCondition } from '../ext/interfaces/where-condition';
import * as redis from 'redis';
import { createHash } from 'crypto';

export declare type RedisConnection = ReturnType<typeof redis.createClient>;
export type SearchDataStructure = 'HASH' | 'JSON';

export type CreateIndexOptions = {
    indexName: string,
    dataStructure: SearchDataStructure,
    schema: Array<string>,
    prefix: string,
    stopWords?: Array<string>
}

export class Redisjson {
    constructor(
        private readonly client: RedisConnection
    ) { }

    static async init(client: RedisConnection) {
        console.info('Starting Redisjson with default constructor...');
        return new Redisjson(client);
    }

    async createIndex<T>(entityType: Type<T>) {
        const { name, uniques, primary, properties, hasOneRelations } = Metadata.getEntityMetadataFromType(entityType);
        let indexHashName = `${name}:index:hash`;
        let indexName = `${name}:index`;
        let prefix = name;
        let definition = properties;

        let data = JSON.stringify({
            definition: definition,
            prefix: prefix,
            indexName: indexName,
            indexHashName: indexHashName,
            dataStructure: 'JSON',
            useStopWords: 'OFF',
            stopWords: [],
        });

        let indexHash = createHash('sha1').update(data).digest('base64');

        let redisSchema = this.getRedisSchema(entityType);

        let currentIndexHash = await this.client.get(indexHashName);
        if (currentIndexHash !== indexHash) {
            await this.dropIndex(entityType);

            const command = [
                'FT.CREATE', indexName,
                'ON', 'JSON',
                'PREFIX', '1', `${prefix}:`];

            // if (stopWords !== undefined)
            //     command.push('STOPWORDS', `${stopWords.length}`, ...stopWords);

            command.push('SCHEMA', ...redisSchema);

            await this.client.sendCommand(command);
            await this.client.set(indexHashName, indexHash);
        }

        // const { name, uniques, primary, isItems, properties, hasOneRelations } = Metadata.getEntityMetadataFromName(entityName);
        for (const property of Object.keys(properties).map(key => properties[key])) {
            if (property.searchable) {
                // 创建Json索引
            }
        }
    }

    async dropIndex<T>(entityType: Type<T>) {
        try {
            const { name } = Metadata.getEntityMetadataFromType(entityType);
            let indexHashName = `${name}:index:hash`;
            let indexName = `${name}:index`;
            await this.client.unlink(indexHashName);
            await this.client.sendCommand(['FT.DROPINDEX', indexName]);
        }
        catch (e) {
            if (e instanceof Error && e.message === "Unknown Index name") {
            }
            else {
                throw e;
            }
        }
    }

    private getRedisSchema<T>(entityType: Type<T>): Array<string> {
        const { name, uniques, primary, properties, hasOneRelations } = Metadata.getEntityMetadataFromType(entityType);

        const redisSchema: Array<string> = [];
        // Object.keys(this.schema.definition).forEach(field => {
        //     redisSchema.push(...this.buildEntry(field));
        // })
        return redisSchema;
    }

    typeCheck(type: string, value: any) {
        switch (type) {
            case 'String':
                if (typeof value === 'string') {
                    return value;
                }
                break;
            case 'Number':
                if (typeof value === 'number') {
                    return value;
                }
                break;
            case 'Date':
                if (value instanceof Date) {
                    return value;
                }
                break;
        }
    }

    /** 
     * 序列化内存数据
     * 字段类型检查
     */
    serializeJson<T>(entity: T, json: any) {
        const { name, primary, properties, hasOneRelations } = Metadata.getEntityMetadataFromInstance(entity);
        const hashKey = name + ':' + entity[primary];
        for (const property of Object.keys(properties).map(key => properties[key])) {
            if (entity[property.name] !== null) {
                if (hasOneRelations !== undefined && hasOneRelations[property.name]) {
                    json[property.name] = {};
                    this.serializeJson(entity[property.name], json[property.name]);
                    continue;
                }
                let valueCheck = this.typeCheck(property.type, entity[property.name]);
                if (!valueCheck) {
                    console.error(`${hashKey}实体${property.name}字段值${entity[property.name]}无效`);
                    throw '数据非法'
                }

                let valueToStore = this.convertPropertyTypeToPrimitive(property, valueCheck);
                json[property.name] = valueToStore;
            }
        }
        return null;
    }

    async create<T>(entity: T): Promise<void> {
        const { name, primary } = Metadata.getEntityMetadataFromInstance(entity);
        const persistedEntity = await this.getOne<T>(entity.constructor as Type<T>, entity[primary]);
        if (persistedEntity) {
            // 检查是否存在
            // throw 'entity exist';
            console.log('对象已经存在', entity[primary]);
            // return;
        }

        // 唯一性字段检查 uniques
        // if (uniques) {
        //     // 检查字段唯一性
        //     for (const uniqueName of uniques) {
        //         const entityWithUnique = await this.getOne<T>(entity.constructor as Type<T>, entity[uniqueName], uniqueName);
        //         if (entityWithUnique !== null && entityWithUnique[primary] !== entity[primary]) {
        //             throw new Error(uniqueName + ' is not unique!');
        //         }
        //         if (entity[uniqueName] !== null) {
        //             await this.client.set(
        //                 this.getUniqueKeyName(name, uniqueName) + ':' + entity[uniqueName],
        //                 entity[primary],
        //             );
        //         }
        //     }
        // }

        const hashKey = name + ':' + entity[primary];
        let json = {};

        this.serializeJson(entity, json);

        await this.client.json.set(hashKey, '.', json);
    }

    async get<T>(entityType: Type<T>, value: any, key?: string): Promise<T> {
        const entity = Object.create(entityType.prototype);
        const valueAsString = String(value);
        const { name, uniques, primary, properties, hasOneRelations } = Metadata.getEntityMetadataFromType(entityType);

        // Search for indexes
        let id: string;
        if (key !== undefined && key !== primary) {
            if (uniques.indexOf(key) == -1) {
                throw '主键或者唯一索引字段';
            }

            // this.client.ft.search()

            // json
        } else {
            id = valueAsString;
            const hashKey = name + ':' + id;
            let json = this.client.json.get(hashKey);
        }

        return;


        // const result = await this.client.hmGet(hashKey, Object.keys(properties).map(key => properties[key].name));
        // const propertiesArray = Object.keys(properties).map(key => properties[key]);

        // let index = 0;
        // for (const resultKey of result) {
        //     if (hasOneRelations !== undefined && hasOneRelations[propertiesArray[index].name] && resultKey !== null) {
        //         entity[propertiesArray[index].name] = await this.getOne(hasOneRelations[propertiesArray[index].name].entityType() as any, resultKey);
        //     } else {
        //         entity[propertiesArray[index].name] = this.convertStringToPropertyType(propertiesArray[index], resultKey);
        //     }
        //     index++;
        // }
        // if (entity[primary] === null) {
        //     return null;
        // }
        // return entity;
    }

    async save<T>(entity: T): Promise<void> {

        const { name, uniques, primary, isItems, properties, hasOneRelations } = Metadata.getEntityMetadataFromInstance(entity);

        const hashKey = name + ':' + entity[primary];

        const persistedEntity = await this.getOne<T>(entity.constructor as Type<T>, entity[primary]);
        if (persistedEntity !== null) {
            const changedFields = [];

            for (const property of Object.keys(properties).map(key => properties[key])) {
                if (entity[property.name] === undefined) {
                    entity[property.name] = persistedEntity[property.name];
                }

                if (entity[property.name] !== persistedEntity[property.name]) {
                    changedFields.push(property.name);

                    if (entity[property.name] === null) {
                        await this.client.hDel(hashKey, property.name);
                    }

                    if (property.searchable && persistedEntity[property.name]) {
                        await this.client.sRem(
                            this.getSearchableKeyName(name, property.name),
                            this.getSearchableValuePrefix(entity[primary]) + persistedEntity[property.name].toLowerCase(),
                        );
                    }

                    // if (property.indexed) {
                    //     await this.dropIndex(persistedEntity, property, persistedEntity[primary]);
                    // }
                }
            }

            if (uniques) {
                const uniquesChanged = changedFields.some(value => uniques.indexOf(value) >= 0);
                if (uniquesChanged) {
                    await this.dropUniqueKeys(persistedEntity);
                }
            }

        }

        if (uniques) {
            for (const uniqueName of uniques) {
                const entityWithUnique = await this.getOne<T>(entity.constructor as Type<T>, entity[uniqueName], uniqueName);
                if (entityWithUnique !== null && entityWithUnique[primary] !== entity[primary]) {
                    throw new Error(uniqueName + ' is not unique!');
                }
                if (entity[uniqueName] !== null) {
                    await this.client.set(
                        this.getUniqueKeyName(name, uniqueName) + ':' + entity[uniqueName],
                        entity[primary],
                    );
                }
            }
        }

        const valuesToStore = [];
        for (const property of Object.keys(properties).map(key => properties[key])) {
            if (entity[property.name] !== null) {

                let valueToStore = this.convertPropertyTypeToPrimitive(property, entity[property.name]);

                if (hasOneRelations !== undefined && hasOneRelations[property.name]) {
                    const relatedEntity = Metadata.getEntityMetadataFromName(hasOneRelations[property.name].entityType().name);
                    valueToStore = entity[property.name][relatedEntity.primary];
                }

                valuesToStore.push(property.name);
                valuesToStore.push(valueToStore);

                if (property.searchable && entity[property.name]) {
                    await this.client.sAdd(
                        this.getSearchableKeyName(name, property.name),
                        this.getSearchableValuePrefix(entity[primary]) + entity[property.name].toLowerCase(),
                    );
                }

                if (property.indexed) {
                    let value = entity[property.name];
                    if (hasOneRelations !== undefined && hasOneRelations[property.name] && entity[property.name] !== null) {
                        const relatedEntity = Metadata.getEntityMetadataFromName(hasOneRelations[property.name].entityType().name);
                        value = entity[property.name][relatedEntity.primary];
                    }
                    if (value !== null) {
                        if (property.type === 'Date' || property.type === 'Number') {
                            await this.client.zAdd(
                                this.getIndexNumberKeyName(name, property.name),
                                this.convertPropertyTypeToPrimitive(property, entity[property.name]),
                                entity[primary],
                            );
                        } else {
                            await this.client.zAdd(
                                this.getIndexKeyName(name, property.name, value),
                                { score: 0, value: 'score' },
                                entity[primary],
                            );
                        }
                    }

                }
            }
        }
        await this.client.hSet(hashKey, valuesToStore);

        if (isItems && persistedEntity === null) {
            await this.client.rPush(this.getListKeyName(name), entity[primary]);
        }

        return null;
    }

    async count<T>(entityType: Type<T>): Promise<number> {
        const { name } = Metadata.getEntityMetadataFromType(entityType);
        const keyName = this.getListKeyName(name);

        return await this.client.lLen(keyName);
    }

    async list<T>(
        entityType: Type<T>,
        where?: {
            conditions: WhereCondition[],
            type: 'AND' | 'OR',
        },
        limit?: number,
        offset?: number,
        orderBy?: OrderBy,
    ): Promise<T[]> {
        const ids = await this.listIds(entityType, where, limit, offset, orderBy);
        const response = [];

        for (const id of ids) {
            response.push(await this.getOne(entityType, id));
        }

        return response;
    }

    async search<T>(entityType: Type<T>, condition: Condition, limit: number): Promise<T[]> {
        const ids = await this.searchIds(entityType, condition, limit);
        const response = [];

        const numberOfResult = (ids.length < limit) ? ids.length : limit;
        for (let index = 0; index < numberOfResult; index++) {
            response.push(await this.getOne(entityType, ids[index]));
        }

        return response;
    }

    async searchIds<T>(entityType: Type<T>, condition: Condition, limit: number): Promise<string[]> {
        const { name } = Metadata.getEntityMetadataFromType(entityType);

        const key = this.getSearchableKeyName(name, condition.key);
        const value = this.getSearchableValuePrefix('*') + '*' + condition.value.toLowerCase() + '*';

        const response: string[] = [];

        let finishedScanning = false;
        let cursor = 0;
        while (!finishedScanning) {
            const scanResponse = (await this.client.sScan(key, cursor));
            cursor = scanResponse.cursor;

            response.push(
                ...scanResponse.members.map((id: string) => id.match(/.+?(?=\:_id_:)/g)[0]),
            );

            if (cursor === 0 || response.length === limit) {
                finishedScanning = true;
            }
        }

        return response;
    }

    async listIds<T>(
        entityType: Type<T>,
        where?: {
            conditions: WhereCondition[],
            type: 'AND' | 'OR',
        },
        limit?: number,
        offset?: number,
        orderBy?: OrderBy,
    ): Promise<string[]> {
        const { name, isItems, properties } = Metadata.getEntityMetadataFromType(entityType);
        if (!isItems) {
            throw new Error(entityType.name + ' can\'t be listed!');
        }

        const keyName = this.getListKeyName(name);

        let start = 0;
        let stop = -1;

        if (offset !== undefined) {
            start = offset;
        }

        if (limit !== undefined) {
            stop = start + limit - 1;
        }

        if (orderBy !== undefined && where === undefined) {
            const sortableKey = this.getIndexNumberKeyName(name, orderBy.field);


            if (orderBy.strategy === 'ASC') {
                return await this.client.zRange(sortableKey, start, stop);
            } else {
                // TODO
                return await this.client.zRange(sortableKey, start, stop);
            }
        }

        if (where !== undefined) {
            if (where.conditions.length === 0) {
                throw new Error('Conditions can\'t be empty');
            }

            const scores: { [key: string]: { min: any, max: any } } = {};

            const equals: WhereCondition[] = [];

            for (const condition of where.conditions) {
                if (condition.comparator === '>') {
                    if (!scores[condition.key]) {
                        scores[condition.key] = { min: '-inf', max: '+inf' };
                    }
                    scores[condition.key].min = this.convertPropertyTypeToPrimitive(properties[condition.key], condition.value);
                }
                if (condition.comparator === '<') {
                    if (!scores[condition.key]) {
                        scores[condition.key] = { min: '-inf', max: '+inf' };
                    }
                    scores[condition.key].max = this.convertPropertyTypeToPrimitive(properties[condition.key], condition.value);
                }

                if (condition.comparator === '!=' || condition.comparator === '=') {

                    if (properties[condition.key] === undefined || !properties[condition.key].indexed) {
                        throw new Error('Property ' + condition.key + ' not found or not indexed');
                    }

                    equals.push(condition);
                }
            }

            if (Object.keys(scores).length === 1 && equals.length === 0 && orderBy === undefined) {
                const scoreKey = Object.keys(scores)[0];
                return await this.client.zRangeByScore(
                    this.getIndexNumberKeyName(name, scoreKey),
                    scores[scoreKey].min,
                    scores[scoreKey].max,
                    // {
                    //     LIMIT: {
                    //         offset: offset ? offset : 0,
                    //         count: limit ? limit : -1
                    //     }
                    // }
                );
            }



            if (equals.length === 1 && Object.keys(scores).length === 0 && orderBy === undefined && equals[0].comparator != "!=") {
                const condition = equals[0];
                return await this.client.zRange(
                    this.getIndexKeyName(name, condition.key, this.convertPropertyTypeToPrimitive(properties[condition.key], condition.value)),
                    start,
                    stop,
                );
            }

            let luaOrderBy: {
                name: string,
                min: string,
                max: string,
                strategy: 'ASC' | 'DESC'
            } = undefined;

            if (orderBy !== undefined) {
                for (const scoreKey in scores) {
                    if (scoreKey === orderBy.field) {
                        luaOrderBy = {
                            name: scoreKey,
                            min: String(scores[scoreKey].min),
                            max: String(scores[scoreKey].max),
                            strategy: orderBy.strategy,
                        }
                    }
                }
                if (luaOrderBy === undefined) {
                    luaOrderBy = {
                        name: orderBy.field,
                        strategy: orderBy.strategy,
                        min: "-inf",
                        max: "+inf",
                    };
                }
            }

            let luaArgs = {
                prefix: this.getIndexPrefix(name),
                listKey: this.getListKeyName(name),
                tempPrefix: 'temp:' + name + ':',
                orderBy: luaOrderBy,
                scores: Object.keys(scores).map((key: string) => ({
                    min: scores[key].min,
                    max: scores[key].max,
                    key,
                })),
                equals,
                limit: limit ? limit : -1,
                offset: offset ? offset : 0,
                type: where.type,
            };

            return;

            // return await this.client.eval(
            //     fs.readFileSync(path.join(__dirname, './lua/complex.query.lua')),
            //     0,
            //     JSON.stringify(luaArgs),
            // );

        }

        return await this.client.lRange(keyName, start, stop);
    }

    async delete<T>(entityType: Type<T>, id: string): Promise<void> {
        const { name, uniques, isItems } = Metadata.getEntityMetadataFromType(entityType);
        const hashKey = name + ':' + id;

        const persistedEntity = await this.getOne(entityType, id);
        if (uniques) {
            await this.dropUniqueKeys(persistedEntity);
        }

        if (isItems) {
            await this.client.lRem(this.getListKeyName(name), 1, id);
        }


        await this.dropSearchables(persistedEntity);

        await this.client.del(hashKey);
    }

    async getOne<T>(entityType: Type<T>, value: any, key?: string): Promise<T> {
        const entity = Object.create(entityType.prototype);
        const valueAsString = String(value);
        const { name, uniques, primary, properties, hasOneRelations } = Metadata.getEntityMetadataFromType(entityType);

        // Search for indexes
        let id: string;
        if (key !== undefined && key !== primary) {
            let indexKey;
            for (const uniqueName of uniques) {
                if (uniqueName === key) {
                    indexKey = this.getUniqueKeyName(name, uniqueName);
                }
            }
            if (indexKey === undefined) {
                throw new Error(key + ' is not an unique field!');
            }
            id = await this.client.get(indexKey + ':' + valueAsString);
        } else {
            id = valueAsString;
        }

        const hashKey = name + ':' + id;

        const result = await this.client.hmGet(hashKey, Object.keys(properties).map(key => properties[key].name));
        const propertiesArray = Object.keys(properties).map(key => properties[key]);

        let index = 0;
        for (const resultKey of result) {
            if (hasOneRelations !== undefined && hasOneRelations[propertiesArray[index].name] && resultKey !== null) {
                entity[propertiesArray[index].name] = await this.getOne(hasOneRelations[propertiesArray[index].name].entityType() as any, resultKey);
            } else {
                entity[propertiesArray[index].name] = this.convertStringToPropertyType(propertiesArray[index], resultKey);
            }
            index++;
        }
        if (entity[primary] === null) {
            return null;
        }
        return entity;
    }

    private convertPropertyTypeToPrimitive(property: PropertyMetadata, value: any): any {
        if (property.type === 'Date') {
            return value.valueOf();
        }
        return value;
    }

    private convertStringToPropertyType(property: PropertyMetadata, value: string): any {
        let convertedValue: any = value;

        if ((value === 'undefined' || value === null) && property.defaultValue !== undefined) {
            return property.defaultValue;
        }

        switch (property.type) {
            case 'Boolean':
                convertedValue = value === 'true';
                break;
            case 'Number':
                convertedValue = Number(value);
                break;
            case 'Date':
                convertedValue = new Date(Number(value));
                break;
        }

        return convertedValue;
    }

    private async dropUniqueKeys<T>(entity: T): Promise<void> {
        const { name, uniques } = Metadata.getEntityMetadataFromInstance(entity);
        for (const uniqueName of uniques) {
            await this.client.del(this.getUniqueKeyName(name, uniqueName) + ':' + entity[uniqueName]);
        }
    }



    private async dropSearchables<T>(entity: T): Promise<void> {
        const { name, properties, primary } = Metadata.getEntityMetadataFromInstance(entity);
        for (const property of Object.keys(properties).map(key => properties[key])) {
            if (property.searchable && entity[property.name]) {
                await this.client.sRem(
                    this.getSearchableKeyName(name, property.name),
                    this.getSearchableValuePrefix(entity[primary]) + entity[property.name].toLowerCase(),
                );
            }
        }
    }

    private getIndexNumberKeyName(entityName: string, indexName: string): string {
        return this.getIndexPrefix(entityName) + indexName;
    }

    private getIndexKeyName(entityName: string, indexName: string, indexValue: string): string {
        return this.getIndexPrefix(entityName) + indexName + ':' + indexValue;
    }

    private getIndexPrefix(entityName: string): string {
        return entityName + ':index:';
    }

    private getListKeyName(entityName: string): string {
        return entityName + ':list';
    }

    private getUniqueKeyName(entityName: string, uniqueName: string): string {
        return entityName + ':unique:' + uniqueName;
    }

    private getSearchableKeyName(entityName: string, fieldName: string): string {
        return entityName + ':search:' + fieldName;
    }

    private getSearchableValuePrefix(id: string): string {
        return id + ':_id_:';
    }

}
