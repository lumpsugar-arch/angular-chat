// const express = require('express'),
//       http = require('http'),
//       path = require('path'),
//       apiRoute = require('./routes/api'),
//       bodyParser = require('body-parser');
//       socket = require('socket.io');
//
// const app = express(),
//       port = process.env.PORT || 5000,
//       clientPath = path.join(__dirname, '../client/src'),
//       server = http.createServer(app),
//       io = socket(server);
//
// app.use(bodyParser.json());
// app.use('/api', apiRoute);
// // app.use(express.static(clientPath));
// // app.get('*', (req, res) => {
// //   res.sendFile(clientPath);
// // });
//
// server.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
//
// io.on('connect', socket => {
//   console.log('user connected');
// });
//
//


var app = require('express')();
var http = require('http');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var redis = require('redis');
var server = http.createServer(app);
var io = socket(server);
var client = redis.createClient();

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
    // console.log(channel, message);
    socket.send(message)
  });

  socket.on('join', msg => {
    console.log('joined');
    const data = JSON.parse(msg);
    users.push(data);
    client.publish('pubsub', JSON.stringify({
      type: 'user',
      msg: data
    }));
  });

  socket.on('message', msg => {
    console.log('send message');
    const data = JSON.parse(msg);
    messages.push(data);
    client.publish('pubsub', JSON.stringify({
      type: 'message',
      msg: data
    }))
  })
});
