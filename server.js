var http = require('http');
var querystring = require('querystring');
var shell = require('shelljs');
var nconf = require('nconf');

nconf.file({ file: 'config.json'});

var manageHook = function(payload) {
  // handle server
  if(payload.repository.id === nconf.get('server').id){
    console.log('>>> updating server');
    shell.cd(nconf.get('client').path);
    shell.exec('git pull');
    shell.exec('npm install');
    shell.exec('pm2 restart ' + nconf.get('server').name);
  }

  // handle client
  if(payload.repository.id === nconf.get('client').id){
    console.log('>>> updating client');
    shell.cd(nconf.get('client').path);
    shell.exec('git pull');
    shell.exec('bower install');
  }
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

server.listen(nconf.get('port'));
console.log('listening on port ' + nconf.get('port'));

