import { user } from './fixtures';
import { createApp } from './helpers/app';
import UserHelper from "./helpers/user";

const app = createApp();
const helper = new UserHelper(app);

describe("Succsessful updating of existing user", () => {
  let newUserId: string;

  beforeAll(done => {
    app.close();
    done();
  })

  afterAll(done => {
    app.close();
    done();
  })

  it("A new user is created by a POST /api/users request (a response containing newly created record is expected)", async () => {
    const result = await helper.createNewUser(user);

    newUserId = result.body.id;

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(expect.objectContaining({
      username: user.username,
      age: user.age,
      hobbies: user.hobbies,
    }))
  });

  it("Get all records with a GET /api/users request (expected an array containing created user)", async () => {
    const result = await helper.getAllUsers();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual([{ ...user, id: newUserId }]);
  });

  it("Get created user by ID with GET /api/user/{userId} request (the created record is expected)", async () => {
    const result = await helper.getUserById(newUserId);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({ ...user, id: newUserId });
  });

  it("Update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)", async () => {
    const updatedFields = { age: 28, hobbies: ["coding", "cooking"] };
    const result = await helper.updateUser(newUserId, updatedFields);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({ ...user, ...updatedFields, id: newUserId });
  });

  it("Delete created user with DELETE api/users/{userId} request (confirmation of successful deletion is expected)", async () => {
    const result = await helper.deleteUser(newUserId);

    expect(result.statusCode).toEqual(204);
  });

  it("Attempt to get deleted user by its ID with GET api/users/{userId} request (expected answer is that there is no such object)", async () => {
    const result = await helper.getUserById(newUserId);

    expect(result.statusCode).toEqual(404);
  });
});
