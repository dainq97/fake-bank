import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Account} from '../models';
import {AccountRepository} from '../repositories';
import {ErrorCode, MappingMessageError} from '../types/error.type';
import {BalanceResponse} from '../types/schema/balance-response.schema';

@injectable({scope: BindingScope.TRANSIENT})
export class AccountServiceService {
  constructor(/* Add @inject to inject parameters */) {}
  @repository(AccountRepository) accountRepository: AccountRepository;

  private async generateAccountNumber(): Promise<string> {
    const accountNumber = Math.floor(Math.random() * 1000000000);
    const account = await this.accountRepository.findOne({
      where: {
        number: accountNumber.toString(),
      },
    });
    if (account) {
      return this.generateAccountNumber();
    }
    return accountNumber.toString();
  }

  public async create(account: Partial<Account>): Promise<Account> {
    const accountNumber = await this.generateAccountNumber();
    account.number = accountNumber;
    return this.accountRepository.create(account);
  }

  public async getBalance(accountNumber: string): Promise<BalanceResponse> {
    const account = await this.accountRepository.findOne({
      where: {
        number: accountNumber,
      },
    });
    if (!account) {
      throw new MappingMessageError(ErrorCode.AccountNotFound, 404);
    }
    return {balance: account.balance};
  }

  public async updateAccount(id: string, data: Account): Promise<void> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new MappingMessageError(ErrorCode.AccountNotFound, 404);
    }

    const {customerId, isPrimary} = account;

    if (data.isPrimary) {
      const currentPrimary = await this.accountRepository.findOne({
        where: {
          customerId,
          isPrimary: true,
        },
      });

      if (currentPrimary) {
        currentPrimary.isPrimary = false;
        await this.accountRepository.updateById(
          currentPrimary.id,
          currentPrimary,
        );
      }
    }

    await this.accountRepository.updateById(id, data);
  }
}
