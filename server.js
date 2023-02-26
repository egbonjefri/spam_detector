const http = require('http');

const express = require("express");

const app = express();

const server = http.createServer(app);
const morgan = require('morgan');

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://jefferys-imac",
  }
},3000);
const path = require('path'); 


app.listen(3000,"localhost",() => console.log("Server listening at port 3000"));


app.use(express.static(path.join(__dirname, 'www/')));
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `User-Agent: ${req.headers['user-agent']}`
  ].join(' ')
}));
io.on('connect', socket => {

  
    socket.on('comment', (data) => {
     
      socket.broadcast.emit("remoteComment", data);
      console.log(data)
    });
  
  });
  
  server.listen(3000, 'jefferys-imac');
