import BaseFieldDefinition from "./base-field-definition";
import NumincrbyFieldDefinition from "./numincrby-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a number. */
interface NumberFieldDefinition extends BaseFieldDefinition, NumincrbyFieldDefinition, SortableFieldDefinition {
  /** Yep. It's a number. */
  type: 'number';
}

export default NumberFieldDefinition;
