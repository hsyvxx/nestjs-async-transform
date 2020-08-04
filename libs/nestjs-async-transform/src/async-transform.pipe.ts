import { ArgumentMetadata, Injectable, PipeTransform, InternalServerErrorException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ASYNC_TRANSFORM_METADATA, MESSAGES } from './constants';
import { plainToClass } from 'class-transformer';
import { types, topoSort } from './utils';
import { AsyncTransformOption } from './async-transform-option';

@Injectable()
export class AsyncTransformPipe implements PipeTransform {
  constructor(private moduleRef: ModuleRef) {}

  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown> {
    if (!metatype || types.includes(metatype)) return value;
    const dto = plainToClass(metatype, value) as Record<string, unknown>;

    const propertyNames = Object.getOwnPropertyNames(dto);
    const nodeNames = propertyNames.filter(n => Reflect.hasMetadata(ASYNC_TRANSFORM_METADATA, dto, n));
    const options = nodeNames.map(n => {
      const option = Reflect.getMetadata(ASYNC_TRANSFORM_METADATA, dto, n) as AsyncTransformOption & {
        propertyName: string;
      };
      option.propertyName = n;
      return option;
    });

    const sortedOptions = topoSort(options, {
      findKey: o => o.propertyName,
      findInputs: n => (n.depend ? n.depend : []),
    });
    if (!sortedOptions) throw new InternalServerErrorException(MESSAGES.m001);

    // transform process
    const transformProcess = sortedOptions.map(async v => {
      const injectData = v.inject.map(i => this.moduleRef.get(i));
      try {
        dto[v.propertyName] = await v.transform(dto, ...injectData);
      } catch (err) {
        throw v.exception(err);
      }
    });
    await Promise.all(transformProcess);

    return dto;
  }
}
