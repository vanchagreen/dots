var mouseX = -1;
var mouseY = -1;

var pixelData = [];

window.onload = function() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:7001/getImageData'
  }).then(function(json) {
    pixelData = json.root;
    var canvas = document.getElementById('canvas');
    canvas.onmousemove = function(e) {mouseX = e.x; mouseY = e.y;};
    drawCanvas();

  })
}

function drawCanvas() {

  window.requestAnimationFrame(drawCanvas);

  var canvas = document.getElementById('canvas');
  var canvasWidth  = canvas.width;
  var canvasHeight = canvas.height;
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  var data = imageData.data;

  for (var i = 0; i < pixelData.length; i++) {
    var x = pixelData[i].origX;
    var y = pixelData[i].origY;
    var idx = (y * canvasWidth + x) * 4;

    var normalizedDistance = Math.sqrt(
      ((mouseX - x) / canvas.height * 255) * ((mouseX - x) / canvas.height * 255) +
      ((mouseY - y) / canvas.height * 255) * ((mouseY - y) / canvas.height * 255) 
    );

    //rainbow
    //Math.sin(.3*normalizedDistance + 0) * 127 + 128 || 0;
    //Math.sin(.3*normalizedDistance + 2) * 127 + 128 || 0;
    //Math.sin(.3*normalizedDistance + 4) * 127 + 128 || 0;

    var rgba = normalizedDistance/255 < .2 ? [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ] : [0, 0, 0];

    data[idx] = rgba[0];
    data[++idx] = rgba[1];
    data[++idx] = rgba[2];
    data[++idx] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
