import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';

@Module({
  imports: [JwtModule.register({ secret: 'secret' })],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
