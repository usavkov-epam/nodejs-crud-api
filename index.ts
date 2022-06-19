import 'dotenv/config';

import cluster from "cluster";
import { cpus } from "os";

import createApp from './src/app';
import { Colors } from './src/helpers/console';

const PORT = process.env.PORT || 3000;
const isScalable = process.argv.includes('--multi')

const app = createApp();

if (cluster.isPrimary && isScalable) {
  const workers = cpus().map(() => cluster.fork());
  
  console.log(`\nCluster is running... Primary PID is ${Colors.magenta(String(process.pid))}.`);
  console.log(`Created ${Colors.green(String(workers.length))} workers.\n`);
 } else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${Colors.cyan(String(PORT))}. PID: ${Colors.magenta(String(process.pid))}.`);
  })
 }
