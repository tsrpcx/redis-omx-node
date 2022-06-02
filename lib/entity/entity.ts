import EntityData from "./entity-data";
import EntityValue from "./entity-value";
import EntityField from "./fields/entity-field";
import EntityBooleanField from "./fields/entity-boolean-field";
import EntityDateField from "./fields/entity-date-field";
import EntityNumberField from "./fields/entity-number-field";
import EntityPointField from "./fields/entity-point-field";
import EntityStringArrayField from "./fields/entity-string-array-field";
import EntityStringField from "./fields/entity-string-field";
import EntityTextField from "./fields/entity-text-field";
import EntityFieldConstructor from "./fields/entity-field-constructor";
import Schema from "../schema/schema";
import SchemaDefinition from "../schema/definition/schema-definition";
import FieldDefinition from "../schema/definition/field-definition";
import SchemaFieldType from "../schema/definition/schema-field-type";
import { RedisJsonData, RedisHashData } from "../client";
import EntityObjectField from "./fields/entity-object-field";
import { Metadata } from "../ext/metadata";
import EntityConstructor from "./entity-constructor";
import EntityNumberArrayField from "./fields/entity-number-array-field";

const ENTITY_FIELD_CONSTRUCTORS: Record<SchemaFieldType, EntityFieldConstructor> = {
  'object': EntityObjectField,
  'string': EntityStringField,
  'number': EntityNumberField,
  'boolean': EntityBooleanField,
  'text': EntityTextField,
  'date': EntityDateField,
  'point': EntityPointField,
  'string[]': EntityStringArrayField,
  'number[]': EntityNumberArrayField,
}

/**
 * An Entity is the class from which objects that Redis OM maps to are made. You need
 * to subclass Entity in your application:
 *
 * ```typescript
 * class Foo extends Entity {}
 * ```
 */
export default abstract class Entity {
  /** The generated entity ID. */
  readonly entityId: string;

  private schemaDef: SchemaDefinition;
  private prefix: string;
  private entityFields: Record<string, EntityField> = {};

  /**
   * Creates an new Entity.
   * @internal
   */
  constructor(schema: Schema<any>, id: string, data: EntityData = {}) {
    this.schemaDef = schema.definition;
    this.prefix = schema.prefix;
    this.entityId = id;
    this.createFields(this.schemaDef, this.entityFields, data);
  }

  /**
   * Create the fields on the Entity.
   * @internal
   */
  private createFields(schemaDef: SchemaDefinition, entityFields: Record<string, EntityField>, data: EntityData) {
    Object.keys(schemaDef).forEach(fieldName => {
      const fieldDef: FieldDefinition = schemaDef[fieldName];
      const fieldType = fieldDef.type;
      const fieldAlias = fieldDef.alias ?? fieldName;
      const fieldValue = data[fieldAlias] ?? null;

      if (fieldDef.childType) {
        let meta = Metadata.getEntityMetadataFromType(fieldDef.childType as any);
        let childFields = entityFields[fieldAlias] = {} as any;
        this.createFields(meta.properties, childFields, data[fieldName] as EntityData ?? {})

        const entityField = new ENTITY_FIELD_CONSTRUCTORS['object'](fieldName, fieldDef, fieldValue, childFields);
        entityFields[fieldAlias] = entityField;
        return;
      }

      const entityField = new ENTITY_FIELD_CONSTRUCTORS[fieldType](fieldName, fieldDef, fieldValue);
      entityFields[fieldAlias] = entityField;
    })
  };

  /**
   * @returns The keyname this {@link Entity} is stored with in Redis.
   */
  get keyName(): string {
    return `${this.prefix}:${this.entityId}`;
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for stringification.
   * @returns a JavaScript object.
   */
  toJSON() {
    const json: Record<string, any> = { entityId: this.entityId }
    Object.keys(this.schemaDef).forEach(field => {
      json[field] = (this as Record<string, any>)[field];
    })
    return json;
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for writing to RedisJSON.
   * @internal
   */
  toRedisJson(): RedisJsonData {
    let data: RedisJsonData = {};
    Object.keys(this.entityFields).forEach(field => {
      const entityField: EntityField = this.entityFields[field];
      data = { ...data, ...entityField.toRedisJson() };
    })
    return data;
  }

  /**
   * Loads this {@link Entity} from Redis JSON data.
   * @internal
   */
  fromRedisJson(data: RedisJsonData) {
    if (!data) return data;
    Object.keys(data).forEach(field => {
      if (!this.entityFields[field]) {
        // TODO YNG 字段定义已经删除，无需处理该字段，是否应该通过自动控制获取哪些字段
        return;
      }
      this.entityFields[field].fromRedisJson(data[field]);
    })
  }

  /**
   * Converts this {@link Entity} to a JavaScript object suitable for writing to a Redis Hash.
   * @internal
   */
  toRedisHash(): RedisHashData {
    let data: RedisHashData = {};
    Object.keys(this.entityFields).forEach(field => {
      const entityField: EntityField = this.entityFields[field];
      data = { ...data, ...entityField.toRedisHash() };
    })
    return data;
  }

  /**
   * Loads this {@link Entity} from Redis Hash data.
   * @internal
   */
  fromRedisHash(data: RedisHashData) {
    Object.keys(data).forEach(field => {
      this.entityFields[field].fromRedisHash(data[field]);
    })
  }
}
