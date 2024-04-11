import {Entity, model, property} from '@loopback/repository';
import {TransactionType} from '../types/common.type';

@model({
  settings: {
    strict: false,
    postgresql: {table: 'transaction_logs'},
    foreignKeys: {
      fk_transaction: {
        name: 'fk_transaction',
        entity: 'Transactions',
        entityKey: 'id',
        foreignKey: 'transactionId',
      },
      fk_customer: {
        name: 'fk_customer',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerId',
      },
      fk_account: {
        name: 'fk_account',
        entity: 'Account',
        entityKey: 'id',
        foreignKey: 'accountId',
      },
    },
  },
})
export class TransactionLog extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    postgresql: {
      dataType: 'uuid',
      extension: 'pgcrypto',
      defaultFn: 'gen_random_uuid()',
    },
    useDefaultIdType: false,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'customerId',
      dataType: 'uuid',
    },
  })
  customerId: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'accountId',
      dataType: 'uuid',
    },
  })
  accountId: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'accountNumber',
      dataType: 'VARCHAR(100)',
      index: true,
      unique: true,
    },
  })
  accountNumber: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(TransactionType),
    },
    postgresql: {
      dataType: 'VARCHAR(20)',
    },
  })
  type: TransactionType;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'transactionId',
      dataType: 'uuid',
    },
    jsonSchema: {
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
  })
  transactionId: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'description',
      dataType: 'TEXT',
    },
  })
  description?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'createdAt',
    },
  })
  createdAt?: Date;

  [prop: string]: any;

  constructor(data?: Partial<TransactionLog>) {
    super(data);
  }
}

export interface TransactionLogRelations {
  // describe navigational properties here
}

export type TransactionLogWithRelations = TransactionLog &
  TransactionLogRelations;
