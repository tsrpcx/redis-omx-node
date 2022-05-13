import { mocked } from 'jest-mock';

import Client from "../../../lib/client";
import { Search, RawSearch } from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing,
  mockClientSearchToReturnSingleHash, mockClientSearchToReturnSingleJsonString,
  mockClientSearchToReturnMultipleHashes, mockClientSearchToReturnMultipleJsonStrings,
  mockClientSearchToReturnPaginatedHashes, mockClientSearchToReturnPaginatedJsonStrings,
  SIMPLE_ENTITY_1, SIMPLE_ENTITY_2, SIMPLE_ENTITY_3, SIMPLE_ENTITY_4, SIMPLE_ENTITY_5 } from '../helpers/search-helpers';

jest.mock('../../../lib/client');


type HashSearch = Search<SimpleHashEntity> | RawSearch<SimpleHashEntity>;
type JsonSearch = Search<SimpleJsonEntity> | RawSearch<SimpleJsonEntity>;

describe("Search", () => {

  beforeEach(() => {
    mocked(Client).mockReset();
    mocked(Client.prototype.search).mockReset();
  });
  
  describe.each([
    [ "FluentSearch", 
      new Search<SimpleHashEntity>(simpleHashSchema, new Client()),
      new Search<SimpleJsonEntity>(simpleJsonSchema, new Client()) ],
    [ "RawSearch",
      new RawSearch<SimpleHashEntity>(simpleHashSchema, new Client()),
      new RawSearch<SimpleJsonEntity>(simpleJsonSchema, new Client()) ]
  ])("%s", (_, hashSearch: HashSearch, jsonSearch: JsonSearch) => {

    describe("#returnAll", () => {
      describe("when running against hashes", () => {
        let entities: SimpleHashEntity[];
        let indexName = 'SimpleHashEntity:index', query = '*';
  
        describe("when querying no results", () => {
          beforeEach(async () => {
            mockClientSearchToReturnNothing();
            entities = await hashSearch.return.all();
          });
  
          it("askes the client for a single page of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(1);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 10 } });
          });
  
          it("returns no results", () => expect(entities).toHaveLength(0));
        });
  
        describe("when querying a single result", () => {
          beforeEach(async () => {
            mockClientSearchToReturnSingleHash();
            entities = await hashSearch.return.all();
          });
  
          it("askes the client for a a single page of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(1);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 10 } });
          });
  
          it("returns the expected single result", () => {
            expect(entities).toHaveLength(1);
            expect(entities).toEqual(expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1)
            ]));
          });
        });
  
        describe("when querying multiple results", () => {
          beforeEach(async () => {
            mockClientSearchToReturnMultipleHashes();
            entities = await hashSearch.return.all();
          });
  
          it("askes the client for a single page of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(1);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 10 } });
          });
  
          it("returns all the results", async () => {
            expect(entities).toHaveLength(3);
            expect(entities).toEqual(expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3)
            ]));
          });
        });
  
        describe("when querying multiple results that cross the page boundry", () => {
          beforeEach(async () => {
            mockClientSearchToReturnPaginatedHashes();
            entities = await hashSearch.return.all({ pageSize: 2 });
          });
  
          it("askes the client for multiple pages of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(3);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 2 } });
          });
  
          it("returns all the results", async () => {
            expect(entities).toHaveLength(5);
            expect(entities).toEqual(expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3),
              expect.objectContaining(SIMPLE_ENTITY_4),
              expect.objectContaining(SIMPLE_ENTITY_5)
            ]));
          });
        });
      });
  
      describe("when running against JSON objects", () => {
        let entities: SimpleJsonEntity[];
        let indexName = 'SimpleJsonEntity:index', query = '*';
  
        describe("when querying no results", () => {
          beforeEach(async () => {
            mockClientSearchToReturnNothing();
            entities = await jsonSearch.return.all();
          });
  
          it("askes the client for a single page of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(1);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 10 } });
          });
  
          it("returns no results", () => expect(entities).toHaveLength(0))
        });
  
        describe("when querying a single result", () => {
          beforeEach(async () => {
            mockClientSearchToReturnSingleJsonString();
            entities = await jsonSearch.return.all();
          });
  
          it("askes the client for a single page of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(1);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 10 } });
          });
  
          it("returns the expected single result", () => {
            expect(entities).toHaveLength(1);
            expect(entities).toEqual(expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1)
            ]));
          });
        });
  
        describe("when querying multiple results", () => {
          beforeEach(async () => {
            mockClientSearchToReturnMultipleJsonStrings();
            entities = await jsonSearch.return.all();
          });
  
          it("askes the client for a single page of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(1);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 10 } });
          });
  
          it("returns all the results", async () => {
            expect(entities).toHaveLength(3);
            expect(entities).toEqual(expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3)
            ]));
          });
        });
  
        describe("when querying multiple results that cross the page boundry", () => {
          beforeEach(async () => {
            mockClientSearchToReturnPaginatedJsonStrings();
            entities = await jsonSearch.return.all({ pageSize: 2 });
          });
  
          it("askes the client for a multiple pages of results", () => {
            expect(Client.prototype.search).toHaveBeenCalledTimes(3);
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 0, count: 2 } });
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 2, count: 2 } });
            expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, limit: { offset: 4, count: 2 } });
          });
  
          it("returns all the results", async () => {
            expect(entities).toHaveLength(5);
            expect(entities).toEqual(expect.arrayContaining([
              expect.objectContaining(SIMPLE_ENTITY_1),
              expect.objectContaining(SIMPLE_ENTITY_2),
              expect.objectContaining(SIMPLE_ENTITY_3),
              expect.objectContaining(SIMPLE_ENTITY_4),
              expect.objectContaining(SIMPLE_ENTITY_5)
            ]));
          });
        });
      });
    });
  });
});
