
class TransactionOperation {
  constructor({ dao, type, args }) {
    this.dao = dao;
    this.type = type;
    this.args = args;
    this.backup = null;
  }

  async exec() {
    switch (this.type) {
      case 'INSERT':
        return this.dao.insert(...this.args);
      case 'UPDATE':
        this.backup = await this.dao.find({ key: this.args[0].key });
        return this.dao.update(...this.args);
      case 'REMOVE':
        this.backup = await this.dao.find({ key: this.args[0].key });
        return this.dao.remove(...this.args);
      default:
        this.backup = await this.dao.find({ key: this.args[0].key });
        return this.dao.update(...this.args);
    }
  }

  rollback() {
    /* eslint-disable no-underscore-dangle */
    switch (this.type) {
      case 'INSERT': {
        const { primaryKey } = this.dao;
        return this.dao.remove({ key: this.args[0][primaryKey] });
      }

      case 'UPDATE': {
        delete this.backup._rev;
        return this.dao.update({
          key: this.args[0].key,
          attrs: this.backup,
        });
      }

      case 'REMOVE': {
        delete this.backup._rev;
        return this.dao.insert(this.backup);
      }

      default: {
        delete this.backup._rev;
        return this.dao.update({
          key: this.args[0].key,
          attrs: this.backup,
        });
      }
    }
  }
}

export default TransactionOperation;
