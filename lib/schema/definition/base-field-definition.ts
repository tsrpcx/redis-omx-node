import EntityValue from "../../entity/entity-value";
import SchemaFieldType from "./schema-field-type";

/** Base interface for all fields. */
interface BaseFieldDefinition {
  /** The type of the field (i.e. string, number, boolean, etc.) */
  type: SchemaFieldType;
  /** Field name, by reflect get */
  name?: string;
  /**
   * The default field name in Redis is the key name defined in the
   * {@link SchemaDefinition}. Overrides the Redis key name if set.
   */
  alias?: string;
  /**
   * default value
   */
  defaultValue?: EntityValue;
  /**
   * Is create index
   */
  indexed?: boolean;

  /**
   * child node object.
   */
  childType?: any;
}

export default BaseFieldDefinition;
