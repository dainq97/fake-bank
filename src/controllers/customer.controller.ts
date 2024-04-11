import {intercept, service} from '@loopback/core';
import {Count, CountSchema, Filter, Where} from '@loopback/repository';
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
import {
  CreateCustomerInterceptor,
  UpdateCustomerInterceptor,
} from '../interceptors';
import {Customer} from '../models';
import {CustomerService} from '../services';
import {TransactionLogRelations} from '../types/common.type';

export class CustomerController {
  constructor(
    @service(CustomerService)
    public customerService: CustomerService,
  ) {}

  @post('/api/customers')
  @intercept(CreateCustomerInterceptor.BINDING_KEY)
  @response(200, {
    description: 'Customer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id', 'status'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id' | 'status'>,
  ): Promise<Customer> {
    return this.customerService.create(customer);
  }

  @get('/api/customers/count')
  @response(200, {
    description: 'Customer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Customer) where?: Where<Customer>): Promise<Count> {
    return this.customerService.customerRepository.count(where);
  }

  @get('/api/customers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerService.customerRepository.find(filter);
  }

  @get('/api/customers/{id}')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Customer)
    filter?: Filter<Customer>,
  ): Promise<Customer> {
    return this.customerService.findById(id, filter);
  }

  @get('/api/customers/{id}/transactions')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async getTransactions(
    @param.path.string('id') id: string,
  ): Promise<TransactionLogRelations[]> {
    return this.customerService.getTransactions(id);
  }

  @patch('/api/customers/{id}')
  @intercept(UpdateCustomerInterceptor.BINDING_KEY)
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    await this.customerService.customerRepository.updateById(id, customer);
  }

  @del('/api/customers/{id}')
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.customerService.deleteById(id);
  }
}
