import { StateMetadata } from './state.metadata';

export class MetadataStorage {

    static global: StateMetadata = {
        names: {},
        isItems: {},
        uniques: {},
        properties: {},
        primary: {}
    };

    static getGlobal(): StateMetadata {
        return MetadataStorage.global;
    }
}
