import { createServer } from 'http';
import url from 'url';
import { config } from './helpers/config';
import { processRequest, sendJsonResponse } from './router';

export const server = createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '/', true);
  const isRouteFound = await processRequest(req, res, parsedUrl);
  if (!isRouteFound) {
    sendJsonResponse(res, 404, 'No handler found');
  }
});

server.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}`);
});
