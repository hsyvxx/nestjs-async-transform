import { ArgumentMetadata, Injectable, PipeTransform, InternalServerErrorException, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ASYNC_TRANSFORM_METADATA, MESSAGES, ASYNC_TRANSFORM_NESTED } from './constants';
import { plainToClass } from 'class-transformer';
import { types, topoSort } from './utils';
import { AsyncTransformOption } from './async-transform-option';

type ProcessOption = AsyncTransformOption & { propertyName: string; type?: Type<unknown>; value: unknown };

@Injectable()
export class AsyncTransformPipe implements PipeTransform {
  constructor(private moduleRef: ModuleRef) {}

  async transform(value: unknown, { metatype, type }: ArgumentMetadata): Promise<unknown> {
    if (!metatype || types.includes(metatype)) return value;
    const dto = plainToClass(metatype, value) as Record<string, unknown>;

    const propertyNames = Object.getOwnPropertyNames(dto);
    const targetNames = propertyNames.filter(n => Reflect.hasMetadata(ASYNC_TRANSFORM_METADATA, dto, n));
    const namedOptions = targetNames.map<ProcessOption>(n => ({
      ...(Reflect.getMetadata(ASYNC_TRANSFORM_METADATA, dto, n) as AsyncTransformOption),
      propertyName: n,
      type: Reflect.getMetadata(ASYNC_TRANSFORM_NESTED, dto, n),
      value: dto[n],
    }));

    const sortedOptions = topoSort(namedOptions, {
      findKey: o => o.propertyName,
      findInputs: n => (n.depend ? n.depend : []),
    });
    if (!sortedOptions) throw new InternalServerErrorException(MESSAGES.m001);

    const transformProcesses = sortedOptions.map(async option => {
      const injectData = option.inject.map(i => this.moduleRef.get(i, { strict: false }));
      try {
        dto[option.propertyName] = await option.transform(dto, ...injectData);
      } catch (err) {
        throw option.exception ? option.exception(err) : err;
      }
    });
    await Promise.all(transformProcesses);

    const recursive = sortedOptions
      .filter(o => o.type)
      .map(async o => {
        dto[o.propertyName] = await this.transform(dto[o.propertyName], { metatype: o.type, type });
      });
    await Promise.all(recursive);

    return dto;
  }
}
