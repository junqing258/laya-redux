const server = require('http').createServer();
const io = require('socket.io')(server, {
  serveClient: false,
  cookie: false
});

server.listen(3000);