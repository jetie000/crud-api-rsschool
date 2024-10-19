import { errorMessages } from '../helpers/errorMessages';
import { ApiError } from '../exceptions/apiError';
import { UserRepository } from '../repositories/userRepository';
import { sendJsonResponse } from '../router';
import { UserService } from '../services/userService';
import { ServerResponse } from 'http';

class UserController {
  constructor(private userService: UserService) {}

  getUsers(res: ServerResponse) {
    sendJsonResponse(res, 200, this.userService.getUsers());
  }

  addUser(parsedBody: object, res: ServerResponse) {
    try {
      const addedUser = this.userService.addUser(parsedBody);
      sendJsonResponse(res, 201, addedUser);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getUserById(id: string, res: ServerResponse) {
    try {
      const user = this.userService.getUser(id);
      sendJsonResponse(res, 200, user);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  updateUser(id: string, parsedBody: object, res: ServerResponse) {
    try {
      const updatedUser = this.userService.updateUser(id, parsedBody);
      sendJsonResponse(res, 200, updatedUser);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  deleteUser(id: string, res: ServerResponse) {
    try {
      this.userService.deleteUser(id);
      sendJsonResponse(res, 204, null);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  handleError(error: unknown, res: ServerResponse) {
    if (error instanceof ApiError) {
      sendJsonResponse(res, error.status, error.message);
    } else {
      sendJsonResponse(res, 500, errorMessages.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userController = new UserController(
  new UserService(new UserRepository())
);
