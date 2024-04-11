import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Account} from '../models';
import {AccountRepository} from '../repositories';
import {AccountServiceService, TransactionService} from '../services';
import {AccoutStatus, TransactionLogRelations} from '../types/common.type';
import {BalanceResponse} from '../types/schema/balance-response.schema';

export class AccountController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @service(AccountServiceService)
    public accountServiceService: AccountServiceService,
    @service(TransactionService) public transactionService: TransactionService,
  ) {}

  @post('/api/accounts')
  @response(200, {
    description: 'Account model instance',
    content: {'application/json': {schema: getModelSchemaRef(Account)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccount',
            exclude: ['id', 'number'],
          }),
        },
      },
    })
    account: Omit<Account, 'id' | 'number'>,
  ): Promise<Account> {
    return this.accountServiceService.create(account);
  }

  @get('/api/accounts/count')
  @response(200, {
    description: 'Account model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Account) where?: Where<Account>): Promise<Count> {
    return this.accountRepository.count(where);
  }

  @get('/api/accounts')
  @response(200, {
    description: 'Array of Account model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Account, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Account) filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.accountRepository.find(filter);
  }

  @get('/api/accounts/{id}')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Account, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Account, {exclude: 'where'})
    filter?: FilterExcludingWhere<Account>,
  ): Promise<Account> {
    return this.accountRepository.findById(id, filter);
  }

  @get('/api/accounts/{accountNumber}/balance')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BalanceResponse, {includeRelations: true}),
      },
    },
  })
  async getBalance(
    @param.path.string('accountNumber') accountNumber: string,
  ): Promise<BalanceResponse> {
    return this.accountServiceService.getBalance(accountNumber);
  }

  @get('/api/accounts/{accountNumber}/transactions')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BalanceResponse, {includeRelations: true}),
      },
    },
  })
  async getTransactions(
    @param.path.string('accountNumber') accountNumber: string,
  ): Promise<TransactionLogRelations[]> {
    return this.transactionService.getTransactionByAccounts([accountNumber]);
  }

  @patch('/api/accounts/{id}')
  @response(204, {
    description: 'Account PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Account,
  ): Promise<void> {
    await this.accountServiceService.updateAccount(id, account);
  }

  @del('/api/accounts/{id}')
  @response(204, {
    description: 'Account DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.accountRepository.updateById(id, {
      deletedAt: new Date(),
      status: AccoutStatus.blocked,
    });
  }
}
