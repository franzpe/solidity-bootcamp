import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!' + randomInt(100);
  }
}
