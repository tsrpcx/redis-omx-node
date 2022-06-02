import BaseFieldDefinition from "./base-field-definition";
import SeparableFieldDefinition from "./separable-field-definition";

/** A field representing a number. */
interface NumberArrayFieldDefinition extends BaseFieldDefinition, SeparableFieldDefinition {
  /** Yep. It's a number. */
  type: 'number[]';
}

export default NumberArrayFieldDefinition;
