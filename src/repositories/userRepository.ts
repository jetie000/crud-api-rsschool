import { User } from '../models/userModel';
import { users } from './db';

export class UserRepository {
  addUser(user: User) {
    users.push(user);
    return user;
  }

  getUsers() {
    return users;
  }

  getUser(id: string) {
    return users.find((user) => user.id === id);
  }

  updateUser(user: User) {
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      return user;
    }
  }

  deleteUser(id: string) {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
  }
}
