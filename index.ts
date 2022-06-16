import 'dotenv/config';

import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((_req, _res) => {
  console.log(123);
})

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
