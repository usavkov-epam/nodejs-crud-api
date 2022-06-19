import request from "supertest";

import { User } from "../../src/types";
import { user } from '../fixtures';

export default class UserHelper {
  app: any;

  constructor(app: any) {
    this.app = app;
  }

  public async createNewUser(data: Partial<User> = user): Promise<any> {
    return request(this.app)
      .post('/api/users')
      .send(data)
      .set('content-type', 'application/json');
  }

  public async getAllUsers(): Promise<any> {
    return request(this.app)
      .get('/api/users');
  }

  public async getUserById(id: string): Promise<any> {
    return request(this.app)
      .get(`/api/users/${id}`);
  }

  public async updateUser(id: string, data: Partial<User>): Promise<any> {
    return request(this.app)
      .put(`/api/users/${id}`)
      .send(data)
      .set('content-type', 'application/json');
  }

  public async deleteUser(id: string): Promise<any> {
    return request(this.app)
      .delete(`/api/users/${id}`);
  }
};
