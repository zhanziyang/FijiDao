import GenericDao from './../../base/GenericDao';
import schema from './schema.js';

class PostDao extends GenericDao {
  constructor(db) {
    super({ db, schema });
  }

  async queryWithPagination({ time, direction, size }) {
    const query = await this.createQuery();
    const compareMethod = direction === -1 ? 'lt' : 'gt';
    return query
      .where('creationTime')[compareMethod](time)
      .sort('-creationTime')
      .limit(size)
      .exec();
  }
}

export default PostDao;
