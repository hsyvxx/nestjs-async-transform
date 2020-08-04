import { ASYNC_TRANSFORM_METADATA } from './constants';
import { Expose, ExposeOptions } from 'class-transformer';
import { AsyncTransformOption } from './async-transform-option';

type AsyncTransformType = <T = unknown, R = unknown>(
  option: AsyncTransformOption<T, R> & { exposeOptions?: ExposeOptions },
) => PropertyDecorator;

export const AsyncTransform: AsyncTransformType = option => (target, propertyKey) => {
  Expose(option.exposeOptions)(target, propertyKey as string);
  Reflect.defineMetadata(ASYNC_TRANSFORM_METADATA, option, target, propertyKey);
};
