import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TransactionLog, TransactionLogRelations} from '../models';

export class TransactionLogRepository extends DefaultCrudRepository<
  TransactionLog,
  typeof TransactionLog.prototype.id,
  TransactionLogRelations
> {
  constructor(@inject('datasources.DB') dataSource: DbDataSource) {
    super(TransactionLog, dataSource);
  }
}
