import { HasOneOptions } from '../interfaces';
import SchemaDefinition from '../../schema/definition/schema-definition';

export interface EntityMetadata {
    name: string;
    primary: string;
    uniques: string[];
    properties: SchemaDefinition;
    isItems: boolean;
    hasOneRelations: {[key: string]: HasOneOptions };
}
