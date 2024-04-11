import {Entity, hasMany, model, property} from '@loopback/repository';
import {SystemStatus} from '../types/common.type';
import {Account} from './account.model';

@model({
  settings: {
    strict: false,
    scope: {where: {deletedAt: null}},
    postgresql: {table: 'customers'},
    hiddenProperties: ['deletedAt'],
  },
})
export class Customer extends Entity {
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
  id?: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'name',
      dataType: 'VARCHAR(100)',
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'email',
      dataType: 'VARCHAR(50)',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'phone',
      dataType: 'VARCHAR(13)',
    },
  })
  phone: string;

  @property({
    type: 'string',
    default: SystemStatus.activated,
    jsonSchema: {
      enum: Object.values(SystemStatus),
    },
    postgresql: {
      dataType: 'VARCHAR(20)',
    },
  })
  status: SystemStatus;

  @hasMany(() => Account, {keyTo: 'customerId'})
  accounts: Account[];

  @property({
    type: 'date',
    postgresql: {
      columnName: 'createdAt',
    },
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updatedAt',
    },
  })
  updatedAt?: string | Date;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'deletedAt',
    },
  })
  deletedAt?: string | Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
