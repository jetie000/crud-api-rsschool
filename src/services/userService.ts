import { UserDto } from '@/dto/userDto';
import { ApiError } from '@/exceptions/ApiError';
import { UserRepository } from '@/repositories/userRepository';
import { getErrorMessageUserDto, getErrorMessageUserId } from '@/helpers/checkUserType';
import { errorMessages } from '@/helpers/errorMessages';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  addUser(user: UserDto) {
    this.checkUserDto(user);
    this.userRepository.addUser(user);
  }

  getUsers() {
    return this.userRepository.getUsers();
  }

  getUser(id: string) {
    this.checkUserId(id);
    const user = this.userRepository.getUser(id);
    if (!user) {
      throw ApiError.NotFoundError(errorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  updateUser(userId: string, user: UserDto) {
    const errorMessageId = getErrorMessageUserId(userId);
    const errorMessageUser = getErrorMessageUserDto(user);
    if (errorMessageId || errorMessageUser) {
      throw ApiError.BadRequest([errorMessageId, errorMessageUser].filter(Boolean).join(', '));
    }
    const userUpdated = this.userRepository.updateUser({ id: userId, ...user });
    if (!userUpdated) {
      throw ApiError.NotFoundError(errorMessages.USER_NOT_FOUND);
    }
    return userUpdated;
  }

  deleteUser(id: string) {
    this.checkUserId(id);
    const isFound = this.userRepository.deleteUser(id);
    if (!isFound) {
      throw ApiError.NotFoundError(errorMessages.USER_NOT_FOUND);
    }
  }

  checkUserId(id: string) {
    const errorMessage = getErrorMessageUserId(id);
    if (errorMessage) {
      throw ApiError.BadRequest(errorMessage);
    }
  }

  checkUserDto(user: UserDto) {
    const errorMessage = getErrorMessageUserDto(user);
    if (errorMessage) {
      throw ApiError.BadRequest(errorMessage);
    }
  }
}
