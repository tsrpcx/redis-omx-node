import EntityField from "./entity-field";
import EntityValue from "../entity-value";
import FieldDefinition from "../../schema/definition/field-definition";

type EntityFieldConstructor = new (name: string, fieldDef: FieldDefinition, value?: EntityValue, childs?: Record<string, EntityField>) => EntityField;

export default EntityFieldConstructor;
