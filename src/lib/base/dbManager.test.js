import RxDB from 'rxdb';
import DbManager from './dbManager';

const dbOptions = {
  ignoreDuplicate: false, // do not allow create duplicate dbs with the same name
};
it('should work if DB connected successfully.', async () => {
  const db = await DbManager.connect(dbOptions);
  expect(RxDB.isRxDatabase(db)).toEqual(true);
});

it('should work if DB disconnected successfully', async () => {
  const db = await DbManager.connect(dbOptions);
  await DbManager.disconnect(db);
  expect(db.destroyed).toEqual(true);
});

it('should work if DB dumped successfully', async () => {
  const db = await DbManager.connect(dbOptions);
  const bakup = await DbManager.dump(db);
  expect(bakup.name).toEqual(db.name);
});
