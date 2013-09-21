var http = require('http');
var querystring = require('querystring');
var shell = require('shelljs');
var nconf = require('nconf');

nconf.file({ file: 'config.json'});

var manageHook = function(payload) {

  var config;

  // handle pubsub server
  config = nconf.get('pubsub-server');
  if(payload.repository.id === config.id && payload.ref == 'refs/heads/' + config.branch){
    console.log('>>> updating pubsub server');
    shell.cd(config.path);
    shell.exec('git pull');
    shell.exec('npm install');
    shell.exec('pm2 restart ' + config.name);
  }

  // handle media server FIXME refator #DRY
  config = nconf.get('media-server');
  if(payload.repository.id === config.id && payload.ref == 'refs/heads/' + config.branch){
    console.log('>>> updating madia server');
    shell.cd(config.path);
    shell.exec('git pull');
    shell.exec('npm install');
    shell.exec('pm2 restart ' + config.name);
  }

  // handle client
  config = nconf.get('client');
  if(payload.repository.id === config.id && payload.ref == 'refs/heads/' + config.branch){
    console.log('>>> updating client');
    shell.cd(config.path);
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

