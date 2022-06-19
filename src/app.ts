import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './controllers';
import ServerApp from './helpers/server';

export default () => {
  const app = new ServerApp();

  app.get('/api/users', getAllUsers);
  app.get('/api/users/${userId}', getUserById);
  app.post('/api/users', addUser);
  app.put('/api/users/${userId}', updateUser);
  app.delete('/api/users/${userId}', deleteUser);

  return app;
}
