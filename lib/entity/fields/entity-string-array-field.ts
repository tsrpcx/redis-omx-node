import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import { RedisHashData } from "../../client";
import StringArrayFieldDefinition from "../../schema/definition/string-array-field-definition";

class EntityStringArrayField extends EntityField {
  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = (this.value as Array<string>).join(this.separator);
    return data;
  }

  fromRedisHash(value: string) {
    this.value = value.split(this.separator);
  }

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isArray(value))
      throw Error(`Expected value with type of 'string[]' but received '${value}'.`);
  }

  protected convertValue(value: EntityValue): EntityValue {
    if (this.isArray(value)) {
      return (value as Array<string>).map((v: any) => v.toString());
    }

    return super.convertValue(value);
  }

  private get separator() {
    return (this.fieldDef as StringArrayFieldDefinition).separator ?? '|';
  }

  protected isStringable(itemValue: any) {
    return this.isString(itemValue) || this.isNumber(itemValue) || this.isBoolean(itemValue);
  }

  private isArray(value: any) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (let item of value) {
      if (!this.isStringable(item)) {
        return false;
      }
    }
    return true;
  }
}

export default EntityStringArrayField;
