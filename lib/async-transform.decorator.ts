import { ASYNC_TRANSFORM_METADATA } from './constants';
import { Expose, ExposeOptions } from 'class-transformer';
import { AsyncTransformOption } from './async-transform-option';

export const AsyncTransform = <T = unknown, R = unknown, E extends Error = Error>(
  option: AsyncTransformOption<T, R, E> & { exposeOptions?: ExposeOptions },
): PropertyDecorator => (target, propertyKey) => {
  Expose(option.exposeOptions)(target, propertyKey as string);
  Reflect.defineMetadata(ASYNC_TRANSFORM_METADATA, option, target, propertyKey);
};
