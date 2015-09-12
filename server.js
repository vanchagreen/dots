var http = require('http');
var fs = require('fs');

var createJSONData = require('./bleh').createJSONData;

var staticDirectory = __dirname + '/public';
var staticFiles = fs.readdirSync(staticDirectory);

var mimeMap = {
  'html': 'text/html',
  'js': 'text/javascript',
  'css': 'text/css',
  'json': 'application/json'
}

http.createServer(function (req, res) {

  var endPoint = req.url.substring(1);

  if (staticFiles.indexOf(endPoint) > -1) {
    fs.readFile(staticDirectory + '/' + endPoint, function(err, text) {
      var extension = endPoint.split('.').pop();
      res.setHeader('Content-Type', mimeMap[extension] || 'text/plain');
      res.end(text);
    })
  }

  if(req.url === '/') {
     fs.readFile(staticDirectory + '/index.html', function(err, text){
       res.setHeader("Content-Type", "text/html");
       res.end(text);
     });
     return;
  }

  if(req.url === "/getImageData") {
    createJSONData().then(function(json) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(json));
    })
  }
}).listen(7001);

console.log('Server running at localhost:7001');