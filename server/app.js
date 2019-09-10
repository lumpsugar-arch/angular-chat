const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const redis = require('redis');
const server = http.createServer(app);
const io = socket(server);
const client = redis.createClient();

const apiRoute = require('./routes/api');

let users = [],
    messages = [];

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.use('/api', apiRoute);

server.listen(3000, () => {
  console.log('listening on 3000');
});

io.on('connection', socket => {
  const subscribe = redis.createClient();
  subscribe.subscribe('pubsub');

  subscribe.on('message', (channel, message) => {
    socket.send(message)
  });

  socket.on('join', msg => {
    const data = JSON.parse(msg);
    users.push(data);
    client.publish('pubsub', JSON.stringify({
      type: 'user',
      msg: data
    }));
  });

  socket.on('message', msg => {
    const data = JSON.parse(msg);
    messages.push(data);
    client.publish('pubsub', JSON.stringify({
      type: 'message',
      msg: data
    }))
  })
});
