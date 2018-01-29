import 'babel-polyfill';

import { DbManager, GroupDao } from './main';
import groups from './lib/impls/groupDao/mockdata';

(async () => {
  const db = await DbManager.connect('fiji');
  const groupDao = new GroupDao(db);

  console.log('Inserting new group');
  await groupDao.insert(groups[0]);
  console.log('Insert success');
  console.log('---------------------------------------');

  console.log('Find group by id: 2586017798');
  const doc = await groupDao.find({ key: '2586017798' });
  console.log(`Found group named: ${doc.name}`);
  console.log('---------------------------------------');

  console.log('Change group name');
  await groupDao.update({
    key: doc.id,
    descriptor: {
      $set: {
        name: 'My Best Team',
      },
    },
  });
  console.log('Update success');
  console.log('Find again');
  const updatedDoc = await groupDao.find({ key: '2586017798' });
  console.log(`Found group named: ${updatedDoc.name}`);
  console.log('---------------------------------------');

  console.log('Remove group');
  await groupDao.remove({ key: updatedDoc.id });
  console.log('Remove success');
  console.log('Find again');
  const group = await groupDao.find({ key: '2586017798' });
  console.log(group);

  console.log('---------------------------------------');
  console.log('Import JSON');
  await groupDao.importDump(groups);
  console.log('Imported');
  const allDocsQ = await groupDao.createQuery();
  const allDocs = await allDocsQ.exec();
  console.log(allDocs);

  console.log('---------------------------------------');
  console.log('Query teams');
  const query = await groupDao.createQuery();
  const result = await query
    .where('type')
    .eq('Team')
    .exec();
  console.log(result);

  console.log('---------------------------------------');
  const query2 = await groupDao.createQuery();
  const result2 = await query2
    .sort('-lastModifiedTime')
    .limit(7)
    .exec();
  console.log(result2);

  await groupDao.clear();
})();
