import { Test, TestingModule } from '@nestjs/testing';
import { NestjsAsyncTransformService } from './nestjs-async-transform.service';

describe('NestjsAsyncTransformService', () => {
  let service: NestjsAsyncTransformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestjsAsyncTransformService],
    }).compile();

    service = module.get<NestjsAsyncTransformService>(NestjsAsyncTransformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
