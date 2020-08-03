import { Module } from '@nestjs/common';
import { NestjsAsyncTransformService } from './nestjs-async-transform.service';

@Module({
  providers: [NestjsAsyncTransformService],
  exports: [NestjsAsyncTransformService],
})
export class NestjsAsyncTransformModule {}
