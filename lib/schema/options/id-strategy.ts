/** A function that generates random {@link Entity.entityId | Entity IDs}. */
type IdStrategy = () => Promise<string>;

export default IdStrategy;
