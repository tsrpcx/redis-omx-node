import BaseFieldDefinition from "./base-field-definition";
import SortableFieldDefinition from "./sortable-field-definition";

/** A field representing a date/time. */
interface ObjectFieldDefinition extends BaseFieldDefinition, SortableFieldDefinition {
  /** Yep. It's a date. */
  type: 'object';
}

export default ObjectFieldDefinition;
