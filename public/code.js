var mouseX = -1;
var mouseY = -1;
var oldMouseX = -1;
var oldMouseY = -1;

var pixelData = [];

window.onload = function() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:7001/getImageData'
  }).then(function(json) {
    pixelData = _.map(json.root, function(pixel) {
      pixel.x = pixel.origX;
      pixel.y = pixel.origY;
      pixel.xVelocity = 0;
      pixel.yVelocity = 0;
      return pixel;
    });
    var canvas = document.getElementById('canvas');
    canvas.height = json.height;
    canvas.width = json.width;
    canvas.onmousemove = function(e) { mouseX = e.x; mouseY = e.y;};
    canvas.onmouseout = function(e) { mouseX = -1; mouseY = -1; }
    drawCanvas();

  })
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
      // var k = 1250;
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

    // var normalizedDistance = Math.sqrt(
    //   ((pixel.x) / canvas.height * 255) * ((pixel.x) / canvas.height * 255) +
    //   ((pixel.y) / canvas.height * 255) * ((pixel.y) / canvas.height * 255) 
    // );


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
