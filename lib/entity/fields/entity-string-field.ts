import EntityValue from "../entity-value";
import EntityStringishField from "./entity-stringish-field";

class EntityStringField extends EntityStringishField {
  protected valdiateValue(value: EntityValue) {
    super.valdiateValue(value);
    if (value !== null && !this.isStringable(value))
      throw Error(`Expected value with type of 'string' but received '${value}'.`);
  }
}

export default EntityStringField;
