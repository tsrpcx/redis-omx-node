[redis-omx](../README.md) / BooleanFieldDefinition

# Interface: BooleanFieldDefinition

A field representing a boolean.

## Hierarchy

- [`BaseFieldDefinition`](BaseFieldDefinition.md)

- [`SortableFieldDefinition`](SortableFieldDefinition.md)

  ↳ **`BooleanFieldDefinition`**

## Table of contents

### Properties

- [alias](BooleanFieldDefinition.md#alias)
- [sortable](BooleanFieldDefinition.md#sortable)
- [type](BooleanFieldDefinition.md#type)

## Properties

### alias

• `Optional` **alias**: `string`

The default field name in Redis is the key name defined in the
[SchemaDefinition](../README.md#schemadefinition). Overrides the Redis key name if set.

#### Inherited from

[BaseFieldDefinition](BaseFieldDefinition.md).[alias](BaseFieldDefinition.md#alias)

#### Defined in

[lib/schema/definition/base-field-definition.ts:12](https://github.com/redis/redis-omx-node/blob/20561ae/lib/schema/definition/base-field-definition.ts#L12)

___

### sortable

• `Optional` **sortable**: `boolean`

Enables sorting by this field.

#### Inherited from

[SortableFieldDefinition](SortableFieldDefinition.md).[sortable](SortableFieldDefinition.md#sortable)

#### Defined in

[lib/schema/definition/sortable-field-definition.ts:4](https://github.com/redis/redis-omx-node/blob/20561ae/lib/schema/definition/sortable-field-definition.ts#L4)

___

### type

• **type**: ``"boolean"``

Yep. It's a boolean.

#### Overrides

[BaseFieldDefinition](BaseFieldDefinition.md).[type](BaseFieldDefinition.md#type)

#### Defined in

[lib/schema/definition/boolean-field-definition.ts:7](https://github.com/redis/redis-omx-node/blob/20561ae/lib/schema/definition/boolean-field-definition.ts#L7)
