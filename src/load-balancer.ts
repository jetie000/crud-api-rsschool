import cluster, { Worker } from 'cluster';
import http from 'http';
import { cpus } from 'os';
import { config } from './helpers/config';
import { handleChangeDataMessage } from './router';

const numCPUs = cpus().length;
const workers: Worker[] = [];
const PORT = Number(config.PORT) || 3000;
let nextWorker = 0;

if (cluster.isPrimary) {
  console.log(`Primary process started, PID: ${process.pid}`);

  for (let i = 1; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT: PORT + i });

    worker.on('message', (message) => {
      handleChangeDataMessage(message);
      workers
        .filter((w) => w.process.pid !== worker.process.pid)
        .forEach((w) => w.send(message));
    });
    workers.push(worker);
  }

  http
    .createServer((req, res) => {
      nextWorker = (nextWorker + 1) % (workers.length + 1);
      const options = {
        hostname: 'localhost',
        port: PORT + nextWorker,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = http.request(options, (workerRes) => {
        res.writeHead(workerRes.statusCode || 500, workerRes.headers);
        workerRes.pipe(res, { end: true });
      });

      req.pipe(proxy, { end: true });
    })
    .listen(PORT, () => {
      console.log(`Load balancer listening on port ${PORT}`);
    });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    const newWorker = cluster.fork({ PORT: PORT + workers.length + 1 });
    workers.push(newWorker);
  });
} else {
  import('./index');
}
