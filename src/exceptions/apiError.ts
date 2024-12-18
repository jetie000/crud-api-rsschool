import { formatErrorMessage } from '../helpers/errorMessages';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static NotFoundError(message: string) {
    return new ApiError(404, formatErrorMessage(message));
  }

  static BadRequest(message: string) {
    return new ApiError(400, formatErrorMessage(message));
  }
}
