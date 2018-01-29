import { getCollection, getDocument, toJSON } from './util';
import QueryController from './queryController';

class GenericDao {
  constructor({ db, schema }) {
    this.db = db;
    this.collectionName = schema.title;
    this.schema = schema;
    this.schemaVersion = schema.version;
    this.queryController = new QueryController({ db, schema });
  }

  async watch(listener) {
    const { db, collectionName, schema } = this;
    const collection = await getCollection({ db, collectionName, schema });
    return collection.$.subscribe(listener);
  }

  async dump() {
    const { db, collectionName, schema } = this;
    const collection = await getCollection({ db, collectionName, schema });
    return collection.dump();
  }

  async importDump(docs) {
    const { db, collectionName, schema } = this;
    const collection = await getCollection({ db, collectionName, schema });
    const json = await collection.dump();
    json.docs = docs;
    return collection.importDump(json);
  }

  async clear() {
    const { db, collectionName, schema } = this;
    const collection = await getCollection({ db, collectionName, schema });
    return collection.remove();
  }

  async insert(obj, { upsert = true, atomic = false } = {}) {
    const { db, collectionName, schema } = this;
    const collection = await getCollection({ db, collectionName, schema });
    let result;
    if (upsert) {
      if (atomic) {
        result = await collection.atomicUpsert(obj);
      } else {
        result = await collection.upsert(obj);
      }
    } else {
      result = await collection.insert(obj);
    }
    if (result) {
      return toJSON(result);
    }
    return false;
  }

  async find({ key }) {
    const { db, collectionName, schema } = this;
    const result = await getDocument({
      key,
      db,
      collectionName,
      schema,
    });
    if (!result || result.deleted) {
      return null;
    }
    return toJSON(result);
  }

  // descriptor base on https://github.com/lgandecki/modifyjs#implemented
  async update({
    key, attrs, atomic, descriptor,
  }) {
    const { db, collectionName, schema } = this;
    const result = await getDocument({
      key,
      db,
      collectionName,
      schema,
    });
    if (!result || result.deleted) {
      throw Error('Document not found');
    }
    const newAttrs = attrs || descriptor.$set;
    if (atomic) {
      if (!newAttrs) {
        throw Error('Need to specify attrs or descripter.$set for atomicUpdate');
      }
      return result.atomicUpdate((doc) => {
        Object.assign(doc, newAttrs);
      });
    }
    if (!descriptor) {
      return result.update({ $set: attrs || {} });
    }
    return result.update(descriptor);
  }

  async remove({ key }) {
    const { db, collectionName, schema } = this;
    const result = await getDocument({
      key,
      db,
      collectionName,
      schema,
    });
    if (!result || result.deleted) {
      throw Error('Document not found');
    }
    return result.remove();
  }

  async createQuery(options) {
    return this.queryController.init(options);
  }

  async findAll() {
    const result = await this.createQuery().exec();
    return toJSON(result);
  }
}

export default GenericDao;
