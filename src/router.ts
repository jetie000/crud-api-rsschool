import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { userController } from './controllers/userController';
import { errorMessages, formatErrorMessage } from './helpers/errorMessages';
import { User } from 'models/userModel';

export const handleChangeDataMessage = ({
  type,
  data,
}: {
  type: string;
  data: User;
}) => {
  switch (type) {
    case 'USER_ADDED':
      userController.userService.addUser(data);
      break;
    case 'USER_UPDATED':
      userController.userService.updateUser(data.id, data);
      break;
    case 'USER_DELETED':
      userController.userService.deleteUser(data.id);
      break;
    default:
      console.log(formatErrorMessage(errorMessages.USER_NOT_FOUND));
      break;
  }
};

process.on('message', handleChangeDataMessage);

export const processRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl: url.UrlWithParsedQuery
) => {
  const { path } = parsedUrl;
  if (req.method === 'GET') {
    if (path === '/api/users') {
      userController.getUsers(res);
      return true;
    }
    if (path?.startsWith('/api/users/')) {
      const [, id] = path.split('/api/users/');
      userController.getUserById(id, res);
      return true;
    }
  } else {
    let body = '';
    const isMatched = await new Promise((resolve) => {
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const parsedBody = body && JSON.parse(body);
          if (req.method === 'POST') {
            if (path === '/api/users') {
              userController.addUser(parsedBody, res);
              resolve(true);
            }
          }
          if (req.method === 'PUT') {
            if (path?.startsWith('/api/users/')) {
              const [, id] = path.split('/api/users/');
              userController.updateUser(id, parsedBody, res);
              resolve(true);
            }
          }
          if (req.method === 'DELETE') {
            if (path?.startsWith('/api/users/')) {
              const [, id] = path.split('/api/users/');
              userController.deleteUser(id, res);
              resolve(true);
            }
          }
        } catch {
          sendJsonResponse(
            res,
            500,
            formatErrorMessage(errorMessages.INTERNAL_SERVER_ERROR)
          );
        }
      });
    });
    return isMatched;
  }

  return false;
};

export const sendJsonResponse = (
  res: ServerResponse,
  statusCode: number,
  payload: unknown
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(payload && JSON.stringify(payload));
};
