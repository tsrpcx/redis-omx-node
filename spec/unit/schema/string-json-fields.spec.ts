import Schema from '../../../lib/schema/schema';
import Entity from '../../../lib/entity/entity';
import SchemaDefinition from '../../../lib/schema/definition/schema-definition';
import DataStructure from '../../../lib/schema/options/data-structure';

import * as logger from '../../../lib/shims/logger';

const warnSpy = jest.spyOn(logger, 'warn');

describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured string for a JSON", {
      schemaDef: { aField: { type: 'string' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|'],
      expectedWarning: null
    }],

    ["that defines an aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|'],
      expectedWarning: null
    }],

    ["that defines an unsorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|'],
      expectedWarning: null
    }],

    ["that defines an unsorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|'],
      expectedWarning: null
    }],

    ["that defines a sorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', '|'],
      expectedWarning: "You have marked the string field 'aField' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines a sorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true, alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', '|'],
      expectedWarning: "You have marked the string field 'aField' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines a separated string for a JSON", {
      schemaDef: { aField: { type: 'string', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';'],
      expectedWarning: null
    }],

    ["that defines a separated and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', ';'],
      expectedWarning: null
    }],

    ["that defines a separated and unsorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false, separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';'],
      expectedWarning: null
    }],

    ["that defines a separated and unsorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: false, alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', ';'],
      expectedWarning: null
    }],

    ["that defines a separated and sorted string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true, separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TAG', 'SEPARATOR', ';'],
      expectedWarning: "You have marked the string field 'aField' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }],

    ["that defines a separated and sorted and aliased string for a JSON", {
      schemaDef: { aField: { type: 'string', sortable: true, alias: 'anotherField', separator: ';' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.anotherField', 'AS', 'anotherField', 'TAG', 'SEPARATOR', ';'],
      expectedWarning: "You have marked the string field 'aField' as sortable but RediSearch doesn't support the SORTABLE argument on a TAG for JSON. Ignored."
    }]

  ])("%s", (_, data) => {

    class TestEntity extends Entity { }

    let redisSchema: Array<string>;
    let schemaDef = data.schemaDef;
    let dataStructure = data.dataStructure as DataStructure;
    let expectedRedisSchema = data.expectedRedisSchema;
    let expectedWarning = data.expectedWarning;

    beforeEach(() => {
      warnSpy.mockReset();
      let schema = new Schema<TestEntity>(TestEntity, schemaDef, { dataStructure });
      redisSchema = schema.redisSchema
    });

    it("generates a Redis schema for the field", () => {
      expect(redisSchema).toEqual(expectedRedisSchema);
    });

    if (expectedWarning) {
      it("generates the expected warning", () => {
        expect(warnSpy).toHaveBeenCalledWith(expectedWarning);
      });
    } else {
      it("does not generate a warning", () => {
        expect(warnSpy).not.toHaveBeenCalled();
      });
    }

  });
});
