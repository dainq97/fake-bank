import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {dbConfig} from '../config';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'DB';
  static readonly defaultConfig = dbConfig;

  constructor(
    @inject('datasources.config.DB', {optional: true})
    dsConfig: object = dbConfig,
  ) {
    super(dsConfig);
  }
}
