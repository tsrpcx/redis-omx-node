import Entity from '../../entity/entity';
import EntityConstructor from '../../entity/entity-constructor';
import { Type } from '../metadata';

export interface HasOneOptions {
    entityType: () => Type<any>;
}