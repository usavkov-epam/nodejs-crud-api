import createApp from '../src/app';
import { user } from './fixtures';
import UserHelper from "./helpers/user";

const PORT = process.env.PORT || 3000;
const server = createApp().listen(PORT, () => console.log(`Test server listening on port ${PORT}`));
const helper = new UserHelper(server);

describe("Succsessful updating of existing user", () => {
  let newUserId: string;

  beforeAll(done => {
    server.close();
    done();
  })

  afterAll(done => {
    server.close();
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
});
