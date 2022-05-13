import Point from "./point";

/**
 * Valid types for properties on an {@link Entity}.
 */
type EntityValue = string | number | boolean | Point | Date | any[] | null | object;

export default EntityValue;
