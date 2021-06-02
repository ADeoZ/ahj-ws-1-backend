const http = require('http');
const Koa = require('koa');
const cors = require('koa2-cors');
const WS = require('ws');

const app = new Koa();

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);


const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

const clients = new Set();
const wsServer = new WS.Server({ server });
wsServer.on('connection', (ws, req) => {
  ws.id = 'DeoZ' + Math.round(Math.random() * 100);
  clients.add(ws);
  ws.on('message', msg => {
    // console.log([...wsServer.clients]);
    // ws.send(ws.id + ': ' + msg);
    // [...wsServer.clients]
    // .filter(o => o.readyState === WS.OPEN)
    // .forEach(o => o.send(ws.id + ': ' + msg));
    for(let client of clients) {
      client.send(ws.id + ': ' + msg);
    }
  });

  ws.send('welcome');
});


server.listen(port, () => console.log('Server started'));
