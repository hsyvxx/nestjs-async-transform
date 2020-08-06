import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../example/app.module';
import { AppController } from '../example/app.controller';
import { JwtService } from '@nestjs/jwt';
import { AppPayload } from 'example/app.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let controller: AppController;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = moduleFixture.get(AppController);
    jwt = moduleFixture.get(JwtService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/parse', () => {
    const token = controller.getToken();
    const prePayload: AppPayload = jwt.verify(token);
    return request(app.getHttpServer())
      .post('/parse')
      .send({ token })
      .set('Content-type', 'application/json')
      .expect({
        token,
        payload: {
          name: prePayload.name,
          age: prePayload.age,
          hello: 'Hello World!',
        },
      });
  });
});
