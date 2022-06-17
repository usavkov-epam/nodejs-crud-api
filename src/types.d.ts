import { IncomingMessage, ServerResponse } from "http";

export interface HandlerOptions {
  [key: string]: any;
}

export type RequestListenerWithOptions = (
  req: IncomingMessage,
  res: ServerResponse,
  options: HandlerOptions,
) => void;

export type ResponceData = string | number | object | null | undefined;

export interface ResponseManager {
  res: ServerResponse;
  statusCode: number;
  data?: ResponceData;
}

export interface Routes {
  [method: string]: {
    [path: string]: RequestListenerWithOptions;
  }
}

export interface StorageField<T> {
  [field: string]: T;
};
export interface Storage {
  [entity: string]: StorageField<any>;
};

export interface User {
  readonly id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export type UserEntity = Promise<User | undefined>;
export type UserEntities = Promise<User[] | undefined>;
