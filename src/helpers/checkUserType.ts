import { errorMessages, formatErrorMessage } from './errorMessages';
import { validate } from 'uuid';

export function getErrorMessageUserDto(obj: object) {
  const messages = [];
  if ('username' in obj) {
    if (typeof obj.username !== 'string') {
      messages.push(errorMessages.USER_USERNAME_IS_INVALID);
    }
  } else {
    messages.push(errorMessages.USER_USERNAME_IS_REQUIRED);
  }

  if ('age' in obj) {
    if (typeof obj.age !== 'number') {
      messages.push(errorMessages.USER_AGE_IS_INVALID);
    }
  } else {
    messages.push(errorMessages.USER_AGE_IS_REQUIRED);
  }

  if ('hobbies' in obj) {
    if (
      !Array.isArray(obj.hobbies) ||
      obj.hobbies.some((hobby) => typeof hobby !== 'string')
    ) {
      messages.push(errorMessages.USER_HOBBIES_IS_INVALID);
    }
  } else {
    messages.push(errorMessages.USER_HOBBIES_IS_REQUIRED);
  }

  if (messages.length > 0) {
    return formatErrorMessage(messages.join(', '));
  }
}

export function getErrorMessageUserId(id: string | undefined) {
  if (!id || !validate(id)) {
    return formatErrorMessage(errorMessages.USER_ID_IS_INVALID);
  }
}
