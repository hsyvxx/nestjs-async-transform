# nest-async-transform

## Installation
`npm install --save nestjs-async-transform`

`yarn add nestjs-async-transform`

## Usage
#### example.dto.ts
```Typescript
import { AsyncTransform } from 'nestjs-async-transform';
import { JwtService } from '@nestjs/jwt';

export interface ExampleUser {
  name: string;
  age: number;
}

export class ExampleDto {
  token: string;

  @AsyncTransform<ExampleDto, ExampleUser>({
    inject: [JwtService],
    transform: (dto, jwt: JwtService) => jwt.verify(dto.token),
  })
  payload: ExampleUser;
}
```

#### example.module.ts
```Typescript
import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: 'secret' })],
  controllers: [ExampleController],
})
export class ExampleModule {}
```

#### example.controller.ts
```Typescript
import { Controller, Body, Post } from '@nestjs/common';
import { AsyncTransformPipe } from 'nestjs-async-transform';
import { ExampleDto, ExampleUser } from './example.dto';

@Controller()
export class ExampleController {
  @Post()
  post(@Body(AsyncTransformPipe) dto: ExampleDto): ExampleUser {
    return dto.payload;
  }
}
```
