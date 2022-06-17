import 'dotenv/config';

import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './src/controllers';

import ServerApp from './src/helpers/server';

const PORT = process.env.PORT || 3000;

const app = new ServerApp();

app.get('/api/users', getAllUsers);
app.get('/api/users/${userId}', getUserById);
app.post('/api/user', addUser);
app.put('/api/user/${userId}', updateUser);
app.delete('/api/users/${userId}', deleteUser);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
