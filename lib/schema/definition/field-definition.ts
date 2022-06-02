import BooleanFieldDefinition from "./boolean-field-definition";
import DateFieldDefinition from "./date-field-definition";
import NumberArrayFieldDefinition from "./number-array-field-definition";
import NumberFieldDefinition from "./number-field-definition";
import ObjectFieldDefinition from "./object-field-definition";
import PointFieldDefinition from "./point-field-definition";
import StringArrayFieldDefinition from "./string-array-field-definition";
import StringFieldDefinition from "./string-field-definition";
import TextFieldDefinition from "./text-field-definition";

/** Contains instructions telling how to map a property on an {@link Entity} to Redis. */
type FieldDefinition = NumberArrayFieldDefinition | ObjectFieldDefinition | StringFieldDefinition | TextFieldDefinition | NumberFieldDefinition | BooleanFieldDefinition | PointFieldDefinition | DateFieldDefinition | StringArrayFieldDefinition;

export default FieldDefinition;
