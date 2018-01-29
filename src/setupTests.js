const indexedDB = require('fake-indexeddb');
const IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

// Create an IDBFactory at window.indexedDB so your code can use IndexedDB.
window.indexedDB = indexedDB;

// Make IDBKeyRange global so your code can create key ranges.
window.IDBKeyRange = IDBKeyRange;
