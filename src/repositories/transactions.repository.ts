import {inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Transactions, TransactionsRelations} from '../models';
import {TransactionType} from '../types/common.type';
import {AccountRepository} from './account.repository';
import {TransactionLogRepository} from './transaction-log.repository';

export class TransactionsRepository extends DefaultCrudRepository<
  Transactions,
  typeof Transactions.prototype.id,
  TransactionsRelations
> {
  constructor(
    @inject('datasources.DB') dataSource: DbDataSource,
    @repository(TransactionLogRepository)
    public transactionLogRepository: TransactionLogRepository,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {
    super(Transactions, dataSource);
  }

  // Add custom repository methods here
  public async create(data: Partial<Transactions>): Promise<Transactions> {
    // Add custom logic here
    const transaction = await super.create(data);
    const [sender, receive] = await Promise.all([
      this.accountRepository.findOne({where: {number: data.senderAccount}}),
      this.accountRepository.findOne({where: {number: data.receiverAccount}}),
    ]);

    if (sender && receive) {
      const dataLog = [
        {
          accountNumber: data.senderAccount,
          type: TransactionType.transfer,
          description: `Transfer to ${data.receiverAccount}`,
          transactionId: transaction.id,
          accountId: sender.id,
          customerId: sender.customerId,
        },
        {
          accountNumber: data.receiverAccount,
          type: TransactionType.receive,
          description: `Receive from ${data.receiverAccount}`,
          transactionId: transaction.id,
          accountId: receive.id,
          customerId: receive.customerId,
        },
      ];
      await this.transactionLogRepository.createAll(dataLog);
    }
    return transaction;
  }
}
