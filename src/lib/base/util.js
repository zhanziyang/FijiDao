export const getCollection = async ({ db, collectionName, schema }) => {
  const existing = db[collectionName];
  if (existing) {
    return existing;
  }
  const { migrationStrategies, ...rxSchema } = schema;
  return db.collection({
    name: collectionName,
    schema: rxSchema,
    migrationStrategies,
  });
};

export const getDocument = async ({
  db, collectionName, schema, key,
}) => {
  const col = await getCollection({ db, collectionName, schema });
  return col.findOne(key).exec();
};

export const toJSON = doc => (Array.isArray(doc) ? doc.map(item => item.toJSON()) : doc.toJSON());

export const fromJSON = (json, collection) =>
  (Array.isArray(json)
    ? json.map(item => collection.newDocument(item))
    : collection.newDocument(json));
