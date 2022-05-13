import { StateMetadata } from './state.metadata';

export class MetadataStorage {

    static global: StateMetadata = {
        names: {},
        isItems: {},
        uniques: {},
        properties: {},
        primary: {},
        hasOneRelations: {},
    };

    static getGlobal(): StateMetadata {
        return MetadataStorage.global;
    }
}
