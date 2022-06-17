import {
  IncomingMessage,
  ServerResponse,
} from 'http';
import { validate } from 'uuid';

import {
  ERRORS,
  HEADERS,
  JSON_TYPE,
} from '../constants';

import {
  Selectors,
  UserModel,
} from '../models';
import {
  HandlerOptions,
  User,
} from '../types';
import {
  send,
  sendClientError,
  sendResponse,
  sendServerError,
  validate as validateRequest,
} from './utils';

const userModel = new UserModel();

export const getAllUsers = async (_req: IncomingMessage, res: ServerResponse): Promise<void> => {
  return userModel.getAll()
    .then(users => send(res, users))
    .catch(err => sendServerError(res, err));
};

export const getUserById = async (
  _req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions,
): Promise<void> => {
  if (!validate(params?.userId)) return sendClientError(res, { errors: [{ message: ERRORS.invalidUserUUID }] });
  
  return userModel.getBy(Selectors.id, params.userId)
    .then(user => (
      user
        ? send(res, user)
        : sendResponse({ res, statusCode: 404, data: { message: ERRORS.userNotFound } })
    ))
    .catch(err => sendServerError(res, err));
}

export const addUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (req.headers[HEADERS.contentType] !== JSON_TYPE) return reject({ message: ERRORS.expectedJson });
    const buffers: any = [];

    req.on('data', (chunk) => {
      buffers.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(buffers).toString());
    });

    req.on('error', (err) => {
      reject(err);
    });
  })
    .then(async (data: any) => {
      try {
        const parsedData = JSON.parse(data);

        const validationErrors = validateRequest(['requiredFields', 'types'])(parsedData);
        if (validationErrors.length) return sendClientError(res, { errors: validationErrors });

        const user = await userModel.create(parsedData as User)
        return send(res, user);
      } catch (error) {
        return sendServerError(res, { errors: [{ message: error }] });
      }
    })
    .catch(({ message }) => sendServerError(res, { errors: [{ error: message || ERRORS.genericError }] }));
};

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions,
): Promise<void> => {
  if (!validate(params?.userId)) return sendClientError(res, { errors: [{ message: ERRORS.invalidUserUUID }] });

  return new Promise((resolve, reject) => {
    if (req.headers[HEADERS.contentType] !== JSON_TYPE) return reject({ message: ERRORS.expectedJson });
    const buffers: any = [];

    req.on('data', (chunk) => {
      buffers.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(buffers).toString());
    });

    req.on('error', (err) => {
      reject(err);
    });
  })
    .then(async (data: any) => {
      try {
        const parsedData = JSON.parse(data);

        const validationErrors = validateRequest(['types'])(parsedData);
        if (validationErrors.length) return sendClientError(res, { errors: validationErrors });

        const user = await userModel.update(params.userId, parsedData as User)
        return send(res, user);
      } catch ({ message }) {
        return sendServerError(res, { errors: [{ message: message || ERRORS.genericError }] });
      }
    })
    .catch(({ message }) => sendServerError(res, { errors: [{ message: message || ERRORS.genericError }] }));
};

export const deleteUser = async (
  _req: IncomingMessage,
  res: ServerResponse,
  { params }: HandlerOptions,
): Promise<void> => {
  if (!validate(params?.userId)) return sendClientError(res, { errors: [{ message: ERRORS.invalidUserUUID }] });
  
  return userModel.delete(params.userId)
    .then(() => sendResponse({ res, statusCode: 204 }))
    .catch(({ message }) => sendServerError(res, { errors: [{ message: message || ERRORS.genericError }] }));
};
