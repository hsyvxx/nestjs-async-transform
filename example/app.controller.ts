import { Controller, Get, Body, Post } from '@nestjs/common';
import { AsyncTransformPipe } from '@app/nestjs-async-transform';
import { JwtService } from '@nestjs/jwt';
import { AppPayload, AppDto } from './app.dto';
import { single } from '@helvetia/random-names';

@Controller()
export class AppController {
  constructor(private readonly jwt: JwtService) {}

  @Post('parse')
  getPayload(@Body(AsyncTransformPipe) dto: AppDto): AppDto {
    return {
      token: dto.token,
      payload: {
        age: dto.payload.age,
        hello: dto.payload.hello,
        name: dto.payload.name,
      },
    };
  }

  @Get('token')
  getToken(): string {
    const payload = new AppPayload();
    payload.name = single();
    payload.age = Math.floor(Math.random() * 100);
    return this.jwt.sign({ ...payload });
  }
}
