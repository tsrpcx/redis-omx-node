import { MetadataStorage } from '../metadata/metadata.storage';
import 'reflect-metadata';
import FieldDefinition from '../../schema/definition/field-definition';

export function MetadataProperty(options: FieldDefinition): Function {
    return (object: object, propertyName: string) => {
        const reflectType = Reflect.getMetadata('design:type', object, propertyName);
        let mtype: any = 'string';
        if (options.type === 'object') {
            mtype = reflectType.name;
        }

        if (MetadataStorage.getGlobal().properties[object.constructor.name] === undefined) {
            MetadataStorage.getGlobal().properties[object.constructor.name] = {};
        }
        MetadataStorage.getGlobal().properties[object.constructor.name][propertyName] = {
            name: propertyName,
            indexed: options.indexed,
            type: mtype,
            defaultValue: options.defaultValue,
        };
    };
}
