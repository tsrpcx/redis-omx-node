[redis-omx](../README.md) / Entity

# Class: Entity

An Entity is the class from which objects that Redis OM maps to are made. You need
to subclass Entity in your application:

```typescript
class Foo extends Entity {}
```

## Table of contents

### Properties

- [entityId](Entity.md#entityid)

### Accessors

- [keyName](Entity.md#keyname)

### Methods

- [toJSON](Entity.md#tojson)

## Properties

### entityId

• `Readonly` **entityId**: `string`

The generated entity ID.

#### Defined in

[lib/entity/entity.ts:38](https://github.com/redis/redis-omx-node/blob/20561ae/lib/entity/entity.ts#L38)

## Accessors

### keyName

• `get` **keyName**(): `string`

#### Returns

`string`

The keyname this [Entity](Entity.md) is stored with in Redis.

#### Defined in

[lib/entity/entity.ts:74](https://github.com/redis/redis-omx-node/blob/20561ae/lib/entity/entity.ts#L74)

## Methods

### toJSON

▸ **toJSON**(): `Record`<`string`, `any`\>

Converts this [Entity](Entity.md) to a JavaScript object suitable for stringification.

#### Returns

`Record`<`string`, `any`\>

a JavaScript object.

#### Defined in

[lib/entity/entity.ts:82](https://github.com/redis/redis-omx-node/blob/20561ae/lib/entity/entity.ts#L82)
