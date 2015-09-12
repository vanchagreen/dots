var fs = require('fs'),
PNG = require('pngjs').PNG;

var fileStream = fs.createWriteStream('data.txt', {flags: 'a'});

fs.createReadStream('green.png')
.pipe(new PNG({
  filterType: 4
}))
.on('parsed', function() {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var idx = (this.width * y + x) << 2;
      var pixel = [this.data[idx], this.data[idx + 1], this.data[idx + 2], this.data[idx + 3]];
      if (pixel[0] != 255 || pixel[1] != 255 || pixel[1] != 255) {
        fileStream.write(idx + ': [' + pixel + '],' + '\n');
      }
    }
  }
  fileStream.end();
});