import {/* inject, */ BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class TransactionLogService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
}
