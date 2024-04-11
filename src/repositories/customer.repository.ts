import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, Customer, CustomerRelations} from '../models';
import {AccountRepository} from './account.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly account: HasManyRepositoryFactory<
    Account,
    typeof Customer.prototype.id
  >;
  constructor(
    @inject('datasources.DB') dataSource: DbDataSource,
    @repository.getter('AccountRepository')
    protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Customer, dataSource);
    this.account = this.createHasManyRepositoryFactoryFor(
      'accounts',
      accountRepositoryGetter,
    );
    this.registerInclusionResolver('accounts', this.account.inclusionResolver);
  }
}
