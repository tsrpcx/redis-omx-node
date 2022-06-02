import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import NumberArrayFieldDefinition from "../../schema/definition/number-array-field-definition";
import { RedisHashData } from "../..";

class EntityNumberArrayField extends EntityField {
  toRedisHash(): RedisHashData {
    const data: RedisHashData = {};
    if (this.value !== null) data[this.name] = (this.value as Array<number>).join(this.separator);
    return data;
  }

  fromRedisHash(value: string) {
    let v = value.split(this.separator);
    (v as any).map((v: any) => {
      let r = Number.parseFloat(value);
      if (Number.isNaN(r)) throw Error(`Non-numeric value of '${v}' read from Redis for number array field.`);
      return r;
    });
    this.value = v;
  }

  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isArray(value))
      throw Error(`Expected value with type of 'number[]' but received ${value}.`);
  }

  protected convertValue(value: EntityValue): EntityValue {
    if (this.isArray(value)) {
      return (value as Array<number>).map((v: any) => Number(v));
    }

    return super.convertValue(value);
  }

  private isArray(value: any) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (let item of value) {
      if (!this.isNumber(item)) {
        return false;
      }
    }
    return true;
  }

  private get separator() {
    return (this.fieldDef as NumberArrayFieldDefinition).separator ?? '|';
  }
}

export default EntityNumberArrayField;
