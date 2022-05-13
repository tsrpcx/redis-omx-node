import DataStructure from "./data-structure";
import IdStrategy from "./id-strategy";
import StopWordOptions from "./stop-word-options";


/**
 * Configuration options for a {@link Schema}.
 */
type SchemaOptions = {

  /**
   * The string that comes before the ID when creating Redis keys for
   * {@link Entity | Entities}. Defaults to the class name of the {@link Entity}.
   * Combined with the results of idStrategy to generate a key. If prefix is `Foo`
   * and idStrategy returns `12345` then the generated key would be `Foo:12345`.
   * */
  prefix?: string;

  /**
   * The name used by RediSearch to store the index for this {@link Schema}. Defaults
   * to prefix followed by `:index`. So, for a prefix of `Foo`, it would use `Foo:index`.
   */
  indexName?: string;

  /**
   * The name used by Redis OM to store the hash of the index for this {@link Schema}.
   * Defaults to prefix followed by `:index:hash`. So, for a prefix of `Foo`, it would
   * use `Foo:index:hash`.
   */
  indexHashName?: string;

  /** The data structure used to store the {@link Entity} in Redis. Can be set
   * to either `JSON` or `HASH`. Defaults to JSON. */
  dataStructure?: DataStructure;

  /**
   * A function that generates a random {@link Entity.entityId | Entity ID}. Defaults
   * to a function that generates [ULIDs](https://github.com/ulid/spec). Combined with
   * prefix to generate a Redis key. If prefix is `Foo` and idStratgey returns `12345`
   * then the generated key would be `Foo:12345`.
   */
  idStrategy?: IdStrategy;

  /**
   * Configures the usage of stop words. Valid values are `OFF`, `DEFAULT`, and `CUSTOM`.
   * Setting this to `OFF` disables all stop words. Setting this to `DEFAULT` uses the
   * stop words intrinsic to RediSearch. Setting this to `CUSTOM` tells RediSearch to
   * use the stop words in `stopWords`.
   */
  useStopWords?: StopWordOptions;

  /**
   * Stop words to be used by this schema. If `useStopWords` is
   * anything other than `CUSTOM`, this option is ignored.
   */
  stopWords?: Array<string>
}

export default SchemaOptions;
