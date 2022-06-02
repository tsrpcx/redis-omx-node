import { MetadataStorage } from '../metadata/metadata.storage';

export function EntityOmx(name: string, options?: { isItem: boolean }) {
    return (target: any) => {
        let isItem = false;
        if (options !== undefined && options.isItem === true) {
            isItem = true;
        }
        MetadataStorage.getGlobal().isItems[target.name] = isItem;
        MetadataStorage.getGlobal().names[target.name] = name;
    };
}
