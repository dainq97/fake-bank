import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {Transactions} from '../models';
import {AccountRepository, TransactionsRepository} from '../repositories';
import {TransactionLogRelations, TransactionStatus} from '../types/common.type';
import {ErrorCode, MappingMessageError} from '../types/error.type';

@injectable({scope: BindingScope.TRANSIENT})
export class TransactionService {
  constructor(
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
    @repository(AccountRepository) public accountRepository: AccountRepository,
  ) {}

  /*
   * Add service methods here
   */

  public async createTransaction(
    transaction: Omit<Transactions, 'id'>,
  ): Promise<Transactions> {
    let transactionsId: string = '';
    let error: Error | null = null;

    try {
      const {senderAccount, receiverAccount, amount} = transaction;

      if (amount < 10000) {
        throw new MappingMessageError(ErrorCode.AmountNotSmallerMin, 400);
      }

      let [source, target] = await Promise.all([
        this.accountRepository.findOne({where: {number: senderAccount}}),
        this.accountRepository.findOne({where: {number: receiverAccount}}),
      ]);

      if (!source) {
        throw new MappingMessageError(ErrorCode.SourceAccountNotFound, 404);
      }

      if (!target) {
        throw new MappingMessageError(ErrorCode.TargetAccountNotFound, 404);
      }

      if (source.balance < amount) {
        throw new MappingMessageError(ErrorCode.AmountNotEnough, 400);
      }

      const newTransaction = await this.startTransaction(transaction);
      transactionsId = newTransaction.id;

      source.balance = Number(source.balance) - amount;
      target.balance = Number(target.balance) + amount;

      await Promise.all([
        this.accountRepository.updateById(source.id, source),
        this.accountRepository.updateById(target.id, target),
      ]);

      // Commit transaction
      await this.commitTransaction(newTransaction);
    } catch (err) {
      error = err;
      await this.rollbackTransaction(transactionsId);
    }

    // Return transaction result or throw error
    if (error) {
      throw error;
    } else {
      return this.transactionsRepository.findById(transactionsId);
    }
  }

  private async startTransaction(
    data: Omit<Transactions, 'id'>,
  ): Promise<Transactions> {
    const transaction = await this.transactionsRepository.create(data);

    return transaction;
  }

  private async commitTransaction(transaction: Transactions): Promise<void> {
    await this.transactionsRepository.updateById(transaction.id, {
      status: TransactionStatus.success,
    });
  }

  private async rollbackTransaction(transactionsId: string): Promise<void> {
    if (transactionsId) {
      await this.transactionsRepository.updateById(transactionsId, {
        status: TransactionStatus.failed,
      });

      // Rollback balances
      const transaction =
        await this.transactionsRepository.findById(transactionsId);
      const {senderAccount, receiverAccount, amount} = transaction;

      let [source, target] = await Promise.all([
        this.accountRepository.findOne({where: {number: senderAccount}}),
        this.accountRepository.findOne({where: {number: receiverAccount}}),
      ]);

      if (!source || !target) {
        return;
      }

      source.balance = Number(source.balance) + amount;
      target.balance = Number(target.balance) - amount;

      await Promise.all([
        this.accountRepository.updateById(source.id, source),
        this.accountRepository.updateById(target.id, target),
      ]);
    }
  }

  public async getTransactionByAccounts(
    accounts: string[],
  ): Promise<TransactionLogRelations[]> {
    const accountNumbers = accounts.map(item => `'${item}'`).join(',');
    const query = `
    SELECT
          t.id,
          t.status,
          t.amount,
          t."senderAccount",
          t."receiverAccount",
          t."createdAt",
          tl.description,
          tl."type",
          tl."customerId",
          tl."accountId"
        FROM transactions AS t
        JOIN transaction_logs AS tl ON t."id" = tl."transactionId"
        WHERE tl."accountNumber" IN (${accountNumbers})
        ORDER BY tl."createdAt" DESC
    `;

    const result: AnyObject = this.transactionsRepository.execute(query);
    return result as TransactionLogRelations[];
  }

  public async getTransactionByCustomerId(
    customerId: string,
  ): Promise<TransactionLogRelations[]> {
    const query = `
    SELECT
          t.id,
          t.status,
          t.amount,
          t."senderAccount",
          t."receiverAccount",
          t."createdAt",
          tl.description,
          tl."type",
          tl."customerId",
          tl."accountId"
        FROM transactions AS t
        JOIN transaction_logs AS tl ON t."id" = tl."transactionId"
        WHERE tl."customerId" = '${customerId}'
        ORDER BY tl."createdAt" DESC
    `;

    const result: AnyObject = this.transactionsRepository.execute(query);
    return result as TransactionLogRelations[];
  }
}
