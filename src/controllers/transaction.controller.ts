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
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Transactions} from '../models';
import {TransactionsRepository} from '../repositories';
import {TransactionService} from '../services';

export class TransactionController {
  constructor(
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
    @service(TransactionService)
    public transactionService: TransactionService,
  ) {}

  @post('/api/transactions', {
    'x-visibility': 'undocumented',
    responses: {
      '200': {
        description: 'Transactions model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Transactions)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transactions, {
            title: 'NewTransactions',
            exclude: ['id'],
          }),
        },
      },
    })
    transactions: Omit<Transactions, 'id'>,
  ): Promise<Transactions> {
    return this.transactionService.createTransaction(transactions);
  }

  @get('/api/transactions/count')
  @response(200, {
    description: 'Transactions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.count(where);
  }

  @get('/api/transactions')
  @response(200, {
    description: 'Array of Transactions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transactions, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Transactions) filter?: Filter<Transactions>,
  ): Promise<Transactions[]> {
    return this.transactionsRepository.find(filter);
  }

  @get('/api/transactions/{id}')
  @response(200, {
    description: 'Transactions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transactions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Transactions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Transactions>,
  ): Promise<Transactions> {
    return this.transactionsRepository.findById(id, filter);
  }
}
