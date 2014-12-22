var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe("water-cooler",function(){
  // If there are any existing browser sessions open they will break the test
  it('Should broadcast a new session once they connect',function(done){
    var client = io.connect(socketURL, options);

    client.on('connection_change',function(sessionCount){
      sessionCount.should.be.a.Number;
      sessionCount.should.equal(1);
      client.disconnect();
      done();
    });
  });
});
