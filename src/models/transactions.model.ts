import {Entity, model, property} from '@loopback/repository';
import {TransactionStatus} from '../types/common.type';

@model({
  settings: {
    strict: false,
    postgresql: {table: 'transactions'},
  },
})
export class Transactions extends Entity {
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
      columnName: 'senderAccount',
      dataType: 'VARCHAR(100)',
    },
  })
  senderAccount: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'receiverAccount',
      dataType: 'VARCHAR(100)',
    },
  })
  receiverAccount: string;

  @property({
    type: 'number',
    jsonSchema: {
      minimum: 0,
    },
    postgresql: {
      columnName: 'amount',
      dataType: 'bigint',
    },
  })
  amount: number;

  @property({
    type: 'string',
    default: TransactionStatus.pending,
    jsonSchema: {
      enum: Object.values(TransactionStatus),
    },
    postgresql: {
      dataType: 'VARCHAR(10)',
    },
  })
  status: TransactionStatus;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'createdAt',
    },
  })
  createdAt?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updatedAt',
    },
  })
  updatedAt?: Date;

  constructor(data?: Partial<Transactions>) {
    super(data);
  }
}

export interface TransactionsRelations {
  // describe navigational properties here
}

export type TransactionsWithRelations = Transactions & TransactionsRelations;
