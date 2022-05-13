import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured date for a HASH", {
      schemaDef: { aField: { type: 'date' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'NUMERIC']
    }],

    ["that defines an aliased date for a HASH", {
      schemaDef: { aField: { type: 'date', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'NUMERIC']
    }],

    ["that defines a sorted date for a HASH", {
      schemaDef: { aField: { type: 'date', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'NUMERIC', 'SORTABLE']
    }],

    ["that defines an unsorted date for a HASH", {
      schemaDef: { aField: { type: 'date', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'NUMERIC']
    }],

    ["that defines a sorted and aliased date for a HASH", {
      schemaDef: { aField: { type: 'date', sortable: true, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'NUMERIC', 'SORTABLE']
    }],

    ["that defines an unsorted and aliased date for a HASH", {
      schemaDef: { aField: { type: 'date', sortable: false, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'NUMERIC']
    }]

  ])("%s", (_, data) => {

    class TestEntity extends Entity {}

    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef;
      let dataStructure = data.dataStructure as DataStructure;
      let expectedRedisSchema = data.expectedRedisSchema;

      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      expect(schema.redisSchema).toEqual(expectedRedisSchema);
    });
  });
});
