import { user } from './fixtures';
import { createApp } from './helpers/app';
import UserHelper from "./helpers/user";

const app = createApp();
const helper = new UserHelper(app);

describe("Succsessful creation of new user", () => {
  let newUserId: string;

  beforeAll(done => {
    app.close();
    done();
  })

  afterAll(done => {
    app.close();
    done();
  })

  it("Get all records with a GET /api/users request (an empty array is expected)", async () => {
    const result = await helper.getAllUsers();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual([]);
  });

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

  it("Get created user by ID with GET /api/user/{userId} request (the created record is expected)", async () => {
    const result = await helper.getUserById(newUserId);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual({ ...user, id: newUserId });
  });
});
