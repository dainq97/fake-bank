import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {Customer} from '../models';
import {AccountRepository, CustomerRepository} from '../repositories';
import {
  AccoutStatus,
  SystemStatus,
  TransactionLogRelations,
} from '../types/common.type';
import {ErrorCode, MappingMessageError} from '../types/error.type';
import {AccountServiceService} from './account-service.service';
import {TransactionService} from './transaction.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerService {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @service(AccountServiceService)
    public accoutService: AccountServiceService,
    @service(TransactionService)
    public transactionService: TransactionService,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {}

  /*
   * Add service methods here
   */

  public async create(
    data: Omit<Customer, 'id' | 'status'>,
  ): Promise<Customer> {
    const customer = await this.customerRepository.create(data);

    if (customer) {
      await this.accoutService.create({
        customerId: customer.id,
        balance: 10000,
        isPrimary: true,
      });
    }

    return customer;
  }

  public async findById(
    id: string,
    filter?: Filter<Customer>,
  ): Promise<Customer> {
    filter = filter || {};
    filter.include = [{relation: 'accounts'}];
    return this.customerRepository.findById(id, filter);
  }

  public async getTransactions(id: string): Promise<TransactionLogRelations[]> {
    const customer = await this.findById(id);

    if (!customer) {
      throw new MappingMessageError(ErrorCode.CustomerNotFound, 404);
    }
    return this.transactionService.getTransactionByCustomerId(id);
  }

  public async deleteById(id: string): Promise<void> {
    const customer = await this.findById(id);
    const accounts = customer.accounts;
    const accountNumbers = accounts.map(account => account.number);

    await this.accountRepository.updateAll(
      {
        deletedAt: new Date(),
        status: AccoutStatus.blocked,
      },
      {
        number: {inq: accountNumbers},
      },
    );

    await this.customerRepository.updateById(id, {
      deletedAt: new Date(),
      status: SystemStatus.deactivated,
    });
  }
}
