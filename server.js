var port = 80;
var express = require('express');
var bodyParser = require('body-parser');  
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
var sessionCount = 0;

// listen on port
server.listen(port);

app.use(bodyParser.text());
console.log("listening on port: " + port);

function speak(text,socket) {
  var ip = socket.request.connection.remoteAddress;
//console.log(ip + ' - ' + text);
  io.emit('speak', text);
}

// register listen events on connection
io.sockets.on('connection',function(socket) {
  sessionCount++;
  console.log(socket.request.connection.remoteAddress + " connected");
  console.log("session count: " + sessionCount)

  io.emit('connection_change',sessionCount);

  socket.on('text_entered',function(data) {
    speak(data,socket);
  });

  socket.on('disconnect', function() {
    sessionCount--;
    io.emit('connection_change',sessionCount);
    console.log(socket.request.connection.remoteAddress + " disconnected");
    console.log("session count: " + sessionCount)
  });
});

// routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/sessions', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({sessions: + sessionCount}));
});

app.use(express.static(__dirname + '/public'));

app.post('/', function(req, res){
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //console.log(ip + ' - ' + req.body);
  speak(req.body);
  res.status(200);
  res.send();
});
