import { createServer } from 'http';
import { config } from './helpers/config';

export const server = createServer((_, res) => {
  res.end('Request accepted');
});

server.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}`);
});
