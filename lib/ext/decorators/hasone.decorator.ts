import { MetadataStorage } from '../metadata/metadata.storage';
import 'reflect-metadata';

export function MetadataHasOne<T>(type: any): Function {
    return (object: object, propertyName: string) => {
        if (MetadataStorage.getGlobal().hasOneRelations[object.constructor.name] === undefined) {
            MetadataStorage.getGlobal().hasOneRelations[object.constructor.name] = {};
        }
        MetadataStorage.getGlobal().hasOneRelations[object.constructor.name][propertyName] = {
            entityType: type,
        };
    };
}
