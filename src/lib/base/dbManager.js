import RxDB, { checkAdapter } from 'rxdb/plugins/core';
import KeycompressionPlugin from 'rxdb/plugins/key-compression';
import AdapterCheckPlugin from 'rxdb/plugins/adapter-check';
import JsonDumpPlugin from 'rxdb/plugins/json-dump';
import ValidatePlugin from 'rxdb/plugins/validate';
import UpdatePlugin from 'rxdb/plugins/update';
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages';
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check';
// import RxDBInMemoryModule from 'rxdb/plugins/in-memory';

import idbAdapter from 'pouchdb-adapter-idb';
import memoryAdapter from 'pouchdb-adapter-memory';

RxDB.plugin(KeycompressionPlugin);
RxDB.plugin(AdapterCheckPlugin);
RxDB.plugin(JsonDumpPlugin);
RxDB.plugin(ValidatePlugin);
RxDB.plugin(UpdatePlugin);
// RxDB.plugin(RxDBInMemoryModule);
if (process.env.NODE_ENV === 'development') {
  RxDB.plugin(RxDBErrorMessagesModule);
  RxDB.plugin(RxDBSchemaCheckModule);
}

let adapter = 'memory';
let adapterPlugin = memoryAdapter;
if (checkAdapter('idb')) {
  adapter = 'idb';
  adapterPlugin = idbAdapter;
}
RxDB.plugin(adapterPlugin);

const DEFAULT_DB_NAME = 'fiji';

class DbManager {
  static async connect({ name = DEFAULT_DB_NAME, ...options } = {}) {
    if (this.dbs[name] && !this.dbs[name].destroyed) {
      return this.dbs[name];
    }

    const db = await RxDB.create({
      name,
      adapter,
      ...options,
    });
    this.dbs[name] = db;
    return db;
  }

  static get(name = DEFAULT_DB_NAME) {
    const db = this.dbs[name];
    if (!db) {
      throw new Error(`Database ${name} not found.`);
    }
    if (db.destroyed) {
      throw new Error(`Database ${name} is destroyed.`);
    }
    return db;
  }

  static disconnect(database) {
    const db = RxDB.isRxDatabase(database) ? database : this.get(database);
    return db.destroy();
  }

  static dump(database) {
    const db = RxDB.isRxDatabase(database) ? database : this.get(database);
    return db.dump();
  }

  static importDump(database) {
    const db = RxDB.isRxDatabase(database) ? database : this.get(database);
    return db.importDump();
  }

  static async remove(database) {
    const db = RxDB.isRxDatabase(database) ? database : this.get(database);
    return db.requestIdlePromise().then(() => db.remove());
  }

  static watch(database, listener) {
    const db = RxDB.isRxDatabase(database) ? database : this.get(database);
    return db.$.subscribe(listener)
  }
}

DbManager.dbs = {};

export default DbManager;
