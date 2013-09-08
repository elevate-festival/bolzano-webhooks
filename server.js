var http = require('http');
var querystring = require('querystring');
var shell = require('shelljs');

var manageHook = function(payload) {
  console.log(payload);
};

var server = http.createServer(function(req, res){
  var body = "";
  req.on('data', function(chunk){
    body += chunk;
  });
  req.on('end', function(){
    payload = querystring.parse(body).payload;
    manageHook(JSON.parse(payload));
  });
  res.writeHead(200);
  res.end();
});

server.listen(5010);

