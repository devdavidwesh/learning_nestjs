import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
  constructor(private readonly helloService: HelloService) {}

  getAllUsers() {
    return [
      {
        id: 1,
        name: 'John Doe',
        activated: true,
      },
      {
        id: 2,
        name: 'Jane Smith',
        activated: false,
      },
      {
        id: 3,
        name: 'Robert Johnson',
        activated: true,
      },
      {
        id: 4,
        name: 'Emily Davis',
        activated: true,
      },
      {
        id: 5,
        name: 'Michael Wilson',
        activated: false,
      },
    ];
  }

  getUserById(id: number) {
    const user = this.getAllUsers().find((user) => user.id === id);
    return user;
  }

  getWelcomeMessage(userId: number) {
    const user = this.getUserById(userId);

    if (!user) {
      return `User not found`;
    }

    return this.helloService.getHelloWithName(user.name);
  }
}
