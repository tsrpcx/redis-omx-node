import SchemaDefinition from '../../schema/definition/schema-definition';

export interface StateMetadata {
    /** 实体名称 */
    names: { [key: string]: string; };
    /** 是否实体条目，实体条目，无需创建索引 */
    isItems: { [key: string]: boolean; };
    uniques: { [key: string]: string[]; };
    properties: { [key: string]: SchemaDefinition };
    primary: { [key: string]: string; };
}
