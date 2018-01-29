import GenericDao from './../../base/genericDao';
// import { toJSON } from './../../base/util';
import schema from './schema.js';

class GroupDao extends GenericDao {
  constructor(db) {
    super({ db, schema });
  }

  async queryWithPagination({ time, direction, size }) {
    const query = await this.createQuery();
    const compareMethod = direction === -1 ? 'lt' : 'gt';
    return query
      .where('lastModifiedTime')[compareMethod](time)
      .sort('-lastModifiedTime')
      .limit(size)
      .exec();
  }
}

export default GroupDao;
