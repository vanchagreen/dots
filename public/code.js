var mouseX = -1;
var mouseY = -1;
var oldMouseX = -1;
var oldMouseY = -1;

var pixelData = [];

function getNonWhitePixels(imageData, width, height) {
  var nonWhiteData = [];
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var idx = (width * y + x) << 2;
      var pixel = [imageData[idx], imageData[idx + 1], imageData[idx + 2]];
      if (pixel[0] < 240 || pixel[1] < 240 || pixel[1] < 240) {
        nonWhiteData.push({origX: x, origY: y, rgba: pixel, x: x, y: y, xVelocity: 0, yVelocity: 0});
      }
    }
  }
  return nonWhiteData;
}

window.onload = function() {

  document.getElementById('upload').onchange = function() {

    pixelData = [];

    var file = this.files[0];
    var urlReader = new FileReader();

    urlReader.onload = function() {
      var img = document.createElement("img");
      img.src = urlReader.result;

      var canvas = document.getElementById('canvas');
      canvas.height = img.height;
      canvas.width = img.width;
      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0 );

      pixelData = getNonWhitePixels(context.getImageData(0, 0, img.width, img.height).data, img.width, img.height);

      canvas.onmousemove = function(e) {
        mouseX = e.x - canvas.getClientRects()[0].left;
        mouseY = e.y - canvas.getClientRects()[0].top;
      };
      canvas.onmouseout = function(e) { mouseX = -1; mouseY = -1; }
      drawCanvas();
    }

    urlReader.readAsDataURL(file);
  }
}

function drawCanvas() {
  window.requestAnimationFrame(drawCanvas);
  var canvas = document.getElementById('canvas');
  var canvasWidth  = canvas.width;
  var canvasHeight = canvas.height;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  var data = imageData.data;

  for (var i = 0; i < pixelData.length; i++) {
    var pixel = pixelData[i];

    var homeDX = pixel.origX - pixel.x;
    var homeDY = pixel.origY - pixel.y;
    var homeDistance = Math.sqrt(homeDX * homeDX + homeDY * homeDY);
    var homeForce = homeDistance * 0.01;
    var homeAngle = Math.atan2(homeDY, homeDX);

    var cursorForce = 0;
    var cursorAngle = 0;

    if (mouseX >= 0) {
      var cursorDX = pixel.x - mouseX;
      var cursorDY = pixel.y - mouseY;
      var cursorDistanceSquared = cursorDX * cursorDX + cursorDY + cursorDY;
      var k = 10000;
      cursorForce = (k > k / cursorDistanceSquared) ? (k / cursorDistanceSquared) : (k);
      cursorAngle = Math.atan2(cursorDY, cursorDX);
    }

    pixel.xVelocity += homeForce * Math.cos(homeAngle) + cursorForce * Math.cos(cursorAngle);
    pixel.yVelocity += homeForce * Math.sin(homeAngle) + cursorForce * Math.sin(cursorAngle);

    pixel.xVelocity *= 0.92;
    pixel.yVelocity *= 0.92;

    pixel.x += pixel.xVelocity;
    pixel.y += pixel.yVelocity;

    if (pixel.x > canvasWidth) pixel.x = canvasWidth;
    if (pixel.x < 0) pixel.x = 0;
    if (pixel.y > canvasHeight) pixel.y = canvasHeight;
    if (pixel.y < 0) pixel.y = 0;

    var idx = (Math.round(pixel.y) * canvasWidth + Math.round(pixel.x)) * 4;

    var rainbowX = canvasWidth/2;
    var rainbowY = canvasHeight/2;

    var normalizedDistance = Math.sqrt(
      Math.pow((pixel.x - rainbowX) / canvas.height * 255, 2) + 
      Math.pow((pixel.y - rainbowY) / canvas.height * 255, 2)
    );

    // data[idx] = Math.sin(.3*normalizedDistance + 0) * 127 + 128;
    // data[++idx] = Math.sin(.3*normalizedDistance + 2) * 127 + 128;
    // data[++idx] = Math.sin(.3*normalizedDistance + 4) * 127 + 128;

    // data[idx] = Math.random() * 255;
    // data[++idx] = Math.random() * 255;
    // data[++idx] = Math.random() * 255;

    // data[idx] = 0;
    // data[++idx] = 0;
    // data[++idx] = 0;

    data[idx] = pixel.rgba[0];
    data[++idx] = pixel.rgba[1];
    data[++idx] = pixel.rgba[2];    

    data[++idx] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
