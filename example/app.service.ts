import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHallo(): string {
    return 'Hello World!';
  }
}
