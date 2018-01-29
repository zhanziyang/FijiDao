import GenericDao from './GenericDao'
import TransactionOperation from './TransactionOperation'

class TransactionDao {
  constructor(dao, transaction) {
    this.dao = dao;
    this.transaction = transaction;
  }

  async operate(type, args) {
    const op = new TransactionOperation({
      dao: this.dao,
      type,
      args,
    });
    let result;
    result = await op.exec();
    this.transaction.operations.push(op);
    return result;
  }

  insert(...args) {
    return this.operate('INSERT', args);
  }

  update(...args) {
    return this.operate('UPDATE', args);
  }

  remove(...args) {
    return this.operate('REMOVE', args);
  }
}

export default TransactionDao;