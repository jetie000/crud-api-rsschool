import { UserCreateDto } from '@/dto/userCreateDto';
import { User } from '@/models/userModel';
import { v4 } from 'uuid';

export class UserRepository {
  users: User[] = [];

  addUser(user: UserCreateDto) {
    const userWithId = { ...user, id: v4() };
    this.users.push(userWithId);
    return userWithId;
  }

  getUsers() {
    return this.users;
  }

  getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  updateUser(user: User) {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return user;
    }
  }

  deleteUser(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}
