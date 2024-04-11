import {Entity, model, property} from '@loopback/repository';
import {AccoutStatus} from '../types/common.type';

@model({
  settings: {
    foreignKeys: {
      fk_customer_account: {
        name: 'fk_customer_account',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerId',
      },
    },
    strict: false,
    scope: {where: {deletedAt: null}},
    postgresql: {table: 'accounts'},
    hiddenProperties: ['deletedAt'],
  },
})
export class Account extends Entity {
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
      columnName: 'number',
      dataType: 'VARCHAR(100)',
      index: true,
      unique: true,
    },
  })
  number: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'balance',
      dataType: 'bigint',
    },
    jsonSchema: {
      minimum: 1000,
    },
  })
  balance: number;

  @property({
    type: 'string',
    required: true,
    index: true,
    postgresql: {
      columnName: 'customerId',
      dataType: 'uuid',
    },
    jsonSchema: {
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
  })
  customerId: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'createdAt',
    },
  })
  createdAt?: Date;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updatedAt',
    },
  })
  updatedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
    postgresql: {
      columnName: 'isPrimary',
      dataType: 'BOOLEAN',
    },
  })
  isPrimary: boolean;

  @property({
    type: 'string',
    default: AccoutStatus.active,
    jsonSchema: {
      enum: Object.values(AccoutStatus),
    },
    postgresql: {
      dataType: 'VARCHAR(20)',
    },
  })
  status: AccoutStatus;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'deletedAt',
    },
  })
  deletedAt?: string | Date;

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
