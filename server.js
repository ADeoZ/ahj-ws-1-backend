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

const clients = [];
const wsServer = new WS.Server({ server });
wsServer.on('connection', (ws, req) => {
  ws.on('message', msg => {
    const command = JSON.parse(msg);
    if (command.event === 'login') {
      const findNickname = clients.findIndex((client) => client.nick === command.message);
      if (findNickname === -1) {
        ws.nick = command.message;
        clients.push(ws);
      } else {
        ws.close(1000, 'Такой логин уже находится в чате');
      }
    }
    // console.log([...wsServer.clients]);
    // ws.send(ws.id + ': ' + msg);
    // [...wsServer.clients]
    // .filter(o => o.readyState === WS.OPEN)
    // .forEach(o => o.send(ws.id + ': ' + msg));
    for(let client of clients) {
      client.send(ws.nick + ': ' + command.message);
    }
  });

  ws.on('close', () => {
    const findNickname = clients.findIndex((client) => client.nick === ws.nick);
    if (findNickname !== -1) {
      clients.splice(findNickname, 1);
    }
    for(let client of clients) {
      client.send(ws.nick + ' отключился');
    }
  });

  // ws.send('welcome');
});


server.listen(port, () => console.log('Server started'));
