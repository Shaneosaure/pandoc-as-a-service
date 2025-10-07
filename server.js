var express = require('express'),
    helpers = require('./helpers'),
    pdc = require('pdc');
    folderPath = __dirname;
    shell = require('shelljs');
    fs = require('fs');

// Add rate limiting middleware
var RateLimit = require('express-rate-limit');
var downloadLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
this.server = express();
this.server.set('views', './views');
this.server.set('view engine', 'ejs');
this.server.use(express.static('public'));

this.server.get('/download', downloadLimiter, function(req,res) {
    console.log('*******Converting script running...******\nDownloading a file\n*******************');
    var filename = folderPath+'/Files/'+fs.readdirSync(folderPath + '/Files', 'binary');
    res.download(filename);
});

this.server.route('/').get(function(req, res) {
  res.render('index');
});

this.server.post('/download', function(req,res){
    console.log('*******Converting script running...******\nCreating and converting a file\n*******************');
    // Download function provided by express
    helpers.getBody(req, function(body) {
      fs.writeFile(folderPath+'/test.md',body, function(err) {
    	  if(err) {
        		console.log(err);
    	  } else {
          const { execFileSync } = require("child_process");
          const path = require("path");
          try {
            const output = execFileSync(
              path.join(folderPath, "convert.sh"),
              ["test.md"],
              { encoding: "utf-8" }
            );
            console.log(`stdout: ${output}`);
          } catch (error) {
            console.log(`error: ${error.message}`);
            return res.sendStatus(500);
          }
          res.sendStatus(200);
        };
      });
    });
});
this.server.post('/:format', function(req, res) {
  var contentType = req.get('Content-Type');

  if (contentType) {
    var from = contentType.split("/")[1];
    var to = req.params.format;

    helpers.getBody(req, function(body) {
      pdc(body, from, to, function(err, result) {
        if (err) res.sendStatus(400)
          else res.append('Content-Type', 'text/' + to).send(result);
      });
    });
  } else res.sendStatus(400)
});

exports.listen = function(port) {
  this.server.listen(port);
  console.log("Express server listening on port %d", port);
};
