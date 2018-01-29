import GroupDao from '.';
import DbManager from './../../base/dbManager';
import mockdata from './mockdata';

let db;
let groupDao;
const group1 = mockdata[0];

beforeAll(async () => {
  db = await DbManager.connect('fiji');
  groupDao = new GroupDao(db);
});

afterAll(async () => {
  await DbManager.disconnect('fiji');
});

it('insert a new group doc', async () => {
  const result = await groupDao.insert(group1);
  expect(result.id).toEqual('2586017798');
});

it('should throw an error if insert a duplicate group doc and upset is set to false', async () => {
  let expectedErr;
  try {
    await groupDao.insert(group1, { upsert: false });
  } catch (err) {
    expectedErr = err;
  } finally {
    expect(expectedErr instanceof Error).toEqual(true);
  }
});

it('find by id', async () => {
  const doc = await groupDao.find({ key: '2586017798' });
  expect(doc.id).toEqual('2586017798');
});

it('update by id with descriptor', async () => {
  await groupDao.update({
    key: '2586017798',
    descriptor: {
      $set: {
        name: 'My best team!',
        isPublic: false,
      },
    },
  });
  const doc = await groupDao.find({ key: '2586017798' });
  expect(doc.name).toEqual('My best team!');
  expect(doc.isPublic).toEqual(false);
});

it('remove by id', async () => {
  await groupDao.remove({ key: '2586017798' });
  const doc = await groupDao.find({ key: '2586017798' });
  expect(doc).toEqual(null);
});

describe('matching query tests', () => {
  beforeEach(async () => {
    await groupDao.importDump(mockdata);
  });

  afterEach(async () => {
    await groupDao.clear();
  });

  it('create a query and find all', async () => {
    const query = await groupDao.createQuery();
    const result = await query.exec();
    expect(result.length).toEqual(mockdata.length);
  });

  it('create a query and find teams', async () => {
    const query = await groupDao.createQuery();
    const result = await query
      .where('type')
      .eq('Team')
      .exec();
    expect(result.length).toEqual(mockdata.filter(item => item.type === 'Team').length);
    expect(result.every(item => item.type === 'Team')).toEqual(true);
  });

  it('create a query and find 7 most recently modified groups', async () => {
    const query = await groupDao.createQuery();
    const result = await query
      .sort('-lastModifiedTime')
      .limit(7)
      .exec();
    expect(result.length).toEqual(7);
    expect(result.every((item, index) => item.id === mockdata[index].id)).toEqual(true);
  });

  it('create a query and find second page 7 most recently modified groups', async () => {
    const query = await groupDao.createQuery();
    const result = await query
      .sort('-lastModifiedTime')
      .skip(7)
      .limit(7)
      .exec();
    expect(result.length).toEqual(7);
    expect(result.every((item, index) => item.id === mockdata[index + 7].id)).toEqual(true);
  });

  it('query with pagination', async () => {
    const result = await groupDao.queryWithPagination({
      time: '2018-01-28T07:15:22.558Z',
      direction: -1,
      size: 10
    })
    expect(result.length).toEqual(10);
    expect(result.every((item, index) => item.id === mockdata[index].id)).toEqual(true);
  });
});


describe('matching subscribe tests', () => {
  let sub;
  beforeEach(async () => {
    await groupDao.importDump(mockdata.slice(0, 10));
  });

  afterEach(async () => {
    await groupDao.clear();
  });

  it('subscribe groups insert change', async (done) => {
    sub = await groupDao.watch((evt) => {
      expect(evt.data.op).toEqual('INSERT');
      sub.unsubscribe();
      done();
    });

    await groupDao.insert(mockdata[10]);
  });

  it('subscribe groups change change', async (done) => {
    sub = await groupDao.watch((evt) => {
      expect(evt.data.op).toEqual('UPDATE');
      sub.unsubscribe();
      done();
    });

    await groupDao.update({
      key: '2586017798',
      descriptor: {
        $set: {
          name: 'My best team!',
          isPublic: false,
        },
      },
    });
  });
});
