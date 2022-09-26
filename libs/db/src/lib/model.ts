import * as dynamoose from 'dynamoose';
import * as dynammoseItem from 'dynamoose/dist/Item';
import { ModelType, InputKey } from 'dynamoose/dist/General';
import { Schema } from 'dynamoose/dist/Schema';
import { Condition } from 'dynamoose/dist/Condition';
import { Table } from 'dynamoose/dist/Table';
import { getuid } from 'process';

export interface BaseItem extends dynammoseItem.Item {
  uId: number;
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export abstract class Model<T extends BaseItem> {
  model: ModelType<T>;

  /** *****************************************
   ** construct the model with model name and schema
   ** @param name: name of the model (table) in dynemodb aws
   ** @param schema: schema of the model
   *****************/
  constructor(name: string, schema: Schema) {
    this.model = dynamoose.model<T>(name, schema);
  }

  /** *****************************************
   ** get the instance of the model
   *****************/
  this(): ModelType<T> {
    return this.model;
  }

  /** *****************************************
   ** gat an item from table using key (combination of pk and sk)
   ** @param key: InputKey to retrieve an item - combination of pk and sk
   ** @param attributes: optional attributes to retrieve specific attributes. If this is ommited, function wll retrieve all attributes in a table
   *****************/
  async get(
    key: InputKey,
    attributes?: string[]
  ): Promise<T> {
    const result = await this.model.get(key, {
      attributes,
      return: 'item',
    });

    return result;
  }


  /** *****************************************
   ** add an item to a dynamo db table
   ** @param item: Partial of full value of a model item that you want to add in a table
   *****************/
  async create(item: Partial<T>): Promise<T> {
    item.uId = getuid();
    item.createdAt = new Date();
    item.createdBy = 'imaanvirbrar';
    const result = await this.model.create(item, {
      return: 'item',
    });
    return result;
  }

  /** *****************************************
   ** update an item in a dynamodb table
   ** @param key: InputKey to retrieve an item - combination of pk and sk
   ** @param item: Partial of full value of a model item that you want to update in a table
   ** @param condition: item will only be updated if passed in Condition is true
   *****************/
  async update(
    key: InputKey,
    item: Partial<T>,
    condition?: Condition
  ): Promise<T> {
    item.updatedAt = new Date();
    item.updatedBy = 'imaanvirbrar';
    const result = await this.model.update(key, item, {
      condition,
      return: 'item',
      returnValues: 'ALL_NEW',
    });
    return result;
  }

  /** *****************************************
   ** delete an item from a dynamodb table
   ** @param key: InputKey to retrieve an item - combination of pk and sk
   ** @param condition: item will only be deleted if passed in Condition is true
   *****************/
  async delete(key: InputKey, condition?: Condition): Promise<void> {
    const result = await this.model.delete(key, {
      condition,
    });
  }

  /** *****************************************
   ** get multiple items from table using keys (combination of pk and sk)
   ** @param keys: Array of InputKey to retrieve items - combination of pk and sk
   ** @param attributes: optional attributes to retrieve specific attributes. If this is ommited, function wll retrieve all attributes in a table
   *****************/
  async batchGet(keys: InputKey[], attributes?: string[]): Promise<T[]> {
    const result = await this.model.batchGet(keys, {
      attributes,
      return: 'items',
    });
    return result;
  }

  /** *****************************************
   ** add or update items in a batch
   ** @param items: Array of Partial of full value of a model item that you want to add /update in a table
   *****************/
  async batchAddUpdate(items: Partial<T>[]): Promise<void> {
    const result = await this.model.batchPut(items);
  }

  /** *****************************************
   ** delete multiple items from table using keys (combination of pk and sk)
   ** @param keys: Array of InputKey to delete items - combination of pk and sk
   *****************/
  async batchDelete(keys: InputKey[]): Promise<void> {
    const result = await this.model.batchDelete(keys);
  }

  /** *****************************************
   ** query a table using one of following - pk, local index or global index
   ** @param filterBy: Queryable atttribute (pk, local index or global index) that we want to query on 
   *****************/
  query(filterBy: string) {
    return this.model.query(filterBy);
  }

  /** *****************************************
   ** perform scan operation on a table - retrieve all the items in a table
   *****************/
  scan() {
    return this.model.scan();
  }

  /** *****************************************
   ** construct an item using json object (key, values)
   ** @param object: construct an item using json object (key, values)
   *****************/
  item(object: { [key: string]: any }): T {
    const item = new this.model(object);
    return item;
  }

  /** *****************************************
   ** save an item
   ** @param item: model item that we want to save
   ** @param condition: item will only be saved if passed in Condition is true
   *****************/
  async saveItem(item: T, condition?: Condition) {
    item.updatedAt = new Date();
    item.updatedBy = 'imaanvirbrar';
    const result = await item.save({
      return: 'item',
      condition: condition,
    });
  }

  partitionKey(): string {
    return this.model.Model.table().hashKey;
  }

  sortKey(): string | undefined {
    return this.model.Model.table().rangeKey;
  }

  table(): Table {
    return this.model.Model.table();
  }

  name(): string {
    return this.model.name;
  }

  async indexes() {
    const indexes = await this.model.table().getInternalProperties(Symbol()).getIndexes();
    return indexes;
  }
}
