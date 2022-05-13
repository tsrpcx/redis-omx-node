import { MetadataStorage } from './metadata.storage';
import { EntityMetadata } from './entity.metadata';
import { Type } from './type';

export class Metadata {

    public static getEntityMetadataFromInstance<T>(entity: T): EntityMetadata {
        return this.getEntityMetadata(entity.constructor.name);
    }

    public static getEntityMetadataFromType<T>(entityType: Type<T>): EntityMetadata {
        return this.getEntityMetadata(entityType.name);
    }

    public static getEntityMetadataFromName(entityName: string): EntityMetadata {
        return this.getEntityMetadata(entityName);
    }

    private static getEntityMetadata<T>(entityName: string): EntityMetadata {
        const { names, primary, properties, isItems, uniques, hasOneRelations } = MetadataStorage.getGlobal();

        if (names[entityName] === undefined) {
            throw new Error(entityName + ' is not an entity!');
        }

        if (!isItems[entityName] && primary[entityName] === undefined) {
            throw new Error(entityName + ' doesn\'t have a primary key defined!');
        }

        return {
            name: names[entityName],
            primary: primary[entityName],
            uniques: uniques[entityName],
            properties: properties[entityName],
            isItems: isItems[entityName],
            hasOneRelations: hasOneRelations[entityName],
        };
    }

}
