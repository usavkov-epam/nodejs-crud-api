import request from "supertest";

import createApp from '../src/app';
import { ERRORS } from "../src/constants";
import UserHelper from "./helpers/user";

const PORT = process.env.PORT || 3000;
const server = createApp().listen(PORT, () => console.log(`Test server listening on port ${PORT}`));
const helper = new UserHelper(server);

const VALID_UUID = '0e6ff114-21d5-4f56-9513-624623b203a0';

describe("Failing request handling", () => {
  beforeAll(done => {
    server.close();
    done();
  })

  afterAll(done => {
    server.close();
    done();
  })

  describe('404 Page not found', () => {
    it("GET request for non-existing endpoint (expected corresponding error and status code)", async () => {
      const result = await request(server).get('/badapi/users');
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual(expect.objectContaining({ error: ERRORS.pageNotFound }))
    });
  
    it("POST request for non-existing endpoint (expected corresponding error and status code)", async () => {
      const result = await request(server).post('/badapi/users');
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual(expect.objectContaining({ error: ERRORS.pageNotFound }))
    });
  
    it("PUT request for non-existing endpoint (expected corresponding error and status code)", async () => {
      const result = await request(server).put('/badapi/users');
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual(expect.objectContaining({ error: ERRORS.pageNotFound }))
    });
  
    it("DELETE request for non-existing endpoint (expected corresponding error and status code)", async () => {
      const result = await request(server).delete('/badapi/users');
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual(expect.objectContaining({ error: ERRORS.pageNotFound }))
    });
  })

  describe('404 User not found', () => {
    it("Attempt to get non-existing user by id with GET /api/users/${userId} (expected corresponding error and status code)", async () => {
      const result = await helper.getUserById(VALID_UUID);
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual({ errors: [{ message: ERRORS.userNotFound }] });
    });
  
    it("Attempt to update non-existing user by id with PUT /api/users/${userId} (expected corresponding error and status code)", async () => {
      const result = await helper.updateUser(VALID_UUID, { username: 'test' });
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual({ errors: [{ message: ERRORS.userNotFound }] });
    });

    it("Attempt to delete non-existing user by id with PUT /api/users/${userId} (expected corresponding error and status code)", async () => {
      const result = await helper.deleteUser(VALID_UUID);
  
      expect(result.statusCode).toEqual(404);
      expect(result.body).toEqual({ errors: [{ message: ERRORS.userNotFound }] });
    });
  });

  describe('400 Invalid UUID of user', () => {
    it("Attempt to get user by invalid id with GET /api/users/${userId} (expected corresponding error and status code)", async () => {
      const result = await helper.getUserById('invalid-uuid');
  
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual({ errors: [{ message: ERRORS.invalidUserUUID }] });
    });

    it("Attempt to update user by invalid id with GET /api/users/${userId} (expected corresponding error and status code)", async () => {
      const result = await helper.updateUser('invalid-uuid', {  username: 'test' });
  
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual({ errors: [{ message: ERRORS.invalidUserUUID }] });
    });

    it("Attempt to delete user by invalid id with GET /api/users/${userId} (expected corresponding error and status code)", async () => {
      const result = await helper.deleteUser('invalid-uuid');
  
      expect(result.statusCode).toEqual(400);
      expect(result.body).toEqual({ errors: [{ message: ERRORS.invalidUserUUID }] });
    });
  });
});
