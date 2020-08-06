import { Type } from '@nestjs/common';

export type AsyncTransformOption<T = unknown, R = unknown, E extends Error = Error> = {
  inject: Array<string | Type<unknown>>;
  transform: (dto: T, ...any: unknown[]) => R | Promise<R>;
  exception?: (err: Error) => E;
  depend?: Array<keyof T>;
  type?: () => Type<unknown>;
};
