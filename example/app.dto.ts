import { AsyncTransform } from '@app/nestjs-async-transform';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';

export class AppPayload {
  name: string;
  age: number;

  @AsyncTransform<AppPayload, string>({
    inject: [AppService],
    transform: (dto, app: AppService) => app.getHallo(),
  })
  hello: string;
}

export class AppDto {
  token: string;

  @AsyncTransform<AppDto, AppPayload>({
    inject: [JwtService],
    transform: (dto, jwt: JwtService) => jwt.verify(dto.token),
    type: () => AppPayload,
  })
  payload: AppPayload;
}
