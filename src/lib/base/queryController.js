import { getCollection, toJSON } from './util';

class QueryController {
  constructor({ db, schema }) {
    this.db = db;
    this.collectionName = schema.title;
    this.schema = schema;
    this.query = null;
  }

  async init(criteria) {
    const { db, collectionName, schema } = this;
    const collection = await getCollection({ db, collectionName, schema });
    this.query = collection.find(criteria);
    return this;
  }

  async exec() {
    const result = await this.query.exec();
    return toJSON(result);
  }

  where(arg) {
    this.query = this.query.where(arg);
    return this;
  }

  eq(arg) {
    this.query = this.query.eq(arg);
    return this;
  }
  or(arg) {
    this.query = this.query.or(arg);
    return this;
  }
  nor(arg) {
    this.query = this.query.nor(arg);
    return this;
  }
  and(arg) {
    this.query = this.query.and(arg);
    return this;
  }
  gt(arg) {
    this.query = this.query.gt(arg);
    return this;
  }
  gte(arg) {
    this.query = this.query.gte(arg);
    return this;
  }
  lt(arg) {
    this.query = this.query.lt(arg);
    return this;
  }
  lte(arg) {
    this.query = this.query.lte(arg);
    return this;
  }
  ne(arg) {
    this.query = this.query.ne(arg);
    return this;
  }
  in(arg) {
    this.query = this.query.in(arg);
    return this;
  }
  nin(arg) {
    this.query = this.query.nin(arg);
    return this;
  }
  all(arg) {
    this.query = this.query.all(arg);
    return this;
  }
  regex(arg) {
    this.query = this.query.regex(arg);
    return this;
  }
  exists(arg) {
    this.query = this.query.exists(arg);
    return this;
  }
  elemMatch(arg) {
    this.query = this.query.elemMatch(arg);
    return this;
  }
  sort(arg) {
    this.query = this.query.sort(arg);
    return this;
  }
  limit(arg) {
    this.query = this.query.limit(arg);
    return this;
  }
  skip(arg) {
    this.query = this.query.skip(arg);
    return this;
  }
}

export default QueryController;
