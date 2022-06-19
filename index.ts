import 'dotenv/config';

import cluster from "cluster";
import { cpus } from "os";

import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './src/controllers';

import { Colors } from './src/helpers/console';
import ServerApp from './src/helpers/server';

const PORT = process.env.PORT || 3000;
const isScalable = process.argv.includes('--multi')

const app = new ServerApp();

app.get('/api/users', getAllUsers);
app.get('/api/users/${userId}', getUserById);
app.post('/api/users', addUser);
app.put('/api/users/${userId}', updateUser);
app.delete('/api/users/${userId}', deleteUser);

if (cluster.isPrimary && isScalable) {
  const workers = cpus().map(() => cluster.fork());
  
  console.log(`\nCluster is running... Primary PID is ${Colors.magenta(String(process.pid))}.`);
  console.log(`Created ${Colors.green(String(workers.length))} workers.\n`);
 } else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${Colors.cyan(String(PORT))}. PID: ${Colors.magenta(String(process.pid))}.`);
  })
 }
