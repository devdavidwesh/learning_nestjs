import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(): string {
    return `Hello fellow hackers we are now accesing your computers`;
  }

  getHelloWithName(name: string): string {
    return `hello ${name}`;
  }
}
