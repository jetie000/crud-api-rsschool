export const errorMessages = {
  USER_NOT_FOUND: 'user not found',
  USER_ID_IS_INVALID: 'user id is invalid',
  USER_USERNAME_IS_REQUIRED: 'user username is required',
  USER_AGE_IS_REQUIRED: 'user age is required',
  USER_HOBBIES_IS_REQUIRED: 'user hobbies is required',
  USER_USERNAME_IS_INVALID: 'user username is invalid',
  USER_AGE_IS_INVALID: 'user age is invalid',
  USER_HOBBIES_IS_INVALID: 'user hobbies is invalid',
  INTERNAL_SERVER_ERROR: 'internal server error',
};

export const formatErrorMessage = (error: string) => {
  return error[0].toUpperCase() + error.slice(1);
};
