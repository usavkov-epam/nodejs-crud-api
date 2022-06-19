import createApp from '../src/app';
import { user } from './fixtures';
import UserHelper from "./helpers/user";

const PORT = process.env.PORT || 3000;
const server = createApp().listen(PORT, () => console.log(`Test server listening on port ${PORT}`));
const helper = new UserHelper(server);

describe("Succsessful creation of new user", () => {
  let newUserId: string;

  beforeAll(done => {
    server.close();
    done();
  })

  afterAll(done => {
    server.close();
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
