import TransactionDao from './TransactionDao'

class Transaction {
  constructor() {
    this.operations = [];
  }

  use(dao) {
    return new TransactionDao(dao, this);
  }

  rollback() {
    return this.operations.reduce(async (prev, current) => {
      return prev.then(await current.rollback());
    }, Promise.resolve());
  }
}

export default Transaction;