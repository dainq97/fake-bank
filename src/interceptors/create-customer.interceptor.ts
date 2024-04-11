import {
  bind,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Customer} from '../models';
import {CustomerRepository} from '../repositories';
import {ErrorCode, MappingMessageError} from '../types/error.type';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({tags: {key: CreateCustomerInterceptor.BINDING_KEY}})
export class CreateCustomerInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${CreateCustomerInterceptor.name}`;
  @repository(CustomerRepository) customerRepository: CustomerRepository;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      const {email, phone}: Customer = invocationCtx.args[0];

      const emailExists = await this.customerRepository.findOne({
        where: {email},
      });

      if (emailExists) {
        throw new MappingMessageError(ErrorCode.EmailExists, 422);
      }

      const phoneExists = await this.customerRepository.findOne({
        where: {phone},
      });
      if (phoneExists) {
        throw new MappingMessageError(ErrorCode.PhoneExists, 422);
      }

      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
