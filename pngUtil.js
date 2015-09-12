var fs = require('fs');

var PNG = require('pngjs').PNG;
var Promise = require('promise');

var filePath = 'panda.png';

exports.createJSONData = function() {
  return new Promise(function(resolve) {
    var json = {root: []};
    fs.createReadStream(filePath)
    .pipe(new PNG({
      filterType: 4
    }))
    .on('parsed', function() {
      json.height = this.height;
      json.width = this.width;

      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          var pixel = [this.data[idx], this.data[idx + 1], this.data[idx + 2]];
          // if (pixel[0] < 250 || pixel[1] < 250 || pixel[1] < 250) {
            json.root.push({origX: x, origY: y, rgba: pixel});
          // }
        }
      }
      resolve(json);
    });
  });
}