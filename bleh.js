var fs = require('fs');

var PNG = require('pngjs').PNG;
var Promise = require('promise');

exports.createJSONData = function() {
  return new Promise(function(resolve) {
    var json = {root: []};
    fs.createReadStream('green.png')
    .pipe(new PNG({
      filterType: 4
    }))
    .on('parsed', function() {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          var pixel = [this.data[idx], this.data[idx + 1], this.data[idx + 2]];
          if (pixel[0] != 255 || pixel[1] != 255 || pixel[1] != 255) {
            json.root.push({origX: x, origY: y});
          }
        }
      }
      resolve(json);
    });
  });
}