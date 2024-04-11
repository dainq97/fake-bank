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
@bind({tags: {key: UpdateCustomerInterceptor.BINDING_KEY}})
export class UpdateCustomerInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${UpdateCustomerInterceptor.name}`;
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
      const {email, phone}: Customer = invocationCtx.args[1];
      const id: string = invocationCtx.args[0];

      const customer = await this.customerRepository.findById(id);

      if (!customer) {
        throw new MappingMessageError(ErrorCode.CustomerNotFound, 404);
      }

      const emailExists = await this.customerRepository.findOne({
        where: {email},
      });

      if (emailExists && emailExists.id !== id) {
        throw new MappingMessageError(ErrorCode.EmailExists, 422);
      }

      const phoneExists = await this.customerRepository.findOne({
        where: {phone},
      });

      if (phoneExists && phoneExists.id !== id) {
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
