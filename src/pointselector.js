
var canvas = document.getElementById('imageCanvas');
canvas.onclick = imageClicked;
canvas.oncontextmenu = imageRightClicked;

var points = [];
var rectW = 20, rectH = 20;

// Logic for mouse button events
var mie = false;
var left, right;
left = mie ? 1 : 0;
right = 2;

var img = new Image();

img.onload = function() {
  canvas.getContext('2d').drawImage(img, 0, 0);
};

var imageIndex = 0;
var floor = Math.floor;

/**
 * Grab the mouse coordinates of the event relative to the canvas.
 */
function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - floor(rect.left),
    y: e.clientY - floor(rect.top)
  };
}

/**
 * Draw an individual marker. Box with cross in it.
 */
function drawMarker(ctx, p) {
  ctx.beginPath();
  ctx.moveTo(p.x-floor(rectW/2), p.y-floor(rectH/2));
  ctx.lineTo(p.x+floor(rectW/2), p.y+floor(rectH/2));
  ctx.closePath();
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.moveTo(p.x-floor(rectW/2), p.y+floor(rectH/2));
  ctx.lineTo(p.x+floor(rectW/2), p.y-floor(rectH/2));
  ctx.closePath();
  ctx.strokeStyle = 'red';
  ctx.stroke();
  
  ctx.strokeStyle = 'black';
  ctx.strokeRect(p.x-floor(rectW/2), p.y-floor(rectH/2), rectW, rectH);
}
  
/**
 * Draw markers on the canvas corresponding to click points.
 */
function drawMarkers(canvas, points) {
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  
  for (var i = 0; i < points.length; i++) {
    drawMarker(ctx, points[i]);
  } 
  
  drawPointList(points);
}   

/**
 * Add to DOM a list corresponding to click points.
 */
function drawPointList(points) {
  $('#pointlistDiv ul').html('');
  
  points.forEach(function(p) {
    var newPointLi = '<li>'+p.x+', '+p.y+'</li>';
    $('#pointlistDiv ul').append(newPointLi);
  });
}  
    
/**
 * Image is clicked; keep track of that point and redraw.
 */
function imageClicked(e) {
  var mousePos = getMousePos(canvas, e);
  points.push({'x': mousePos.x, 'y': mousePos.y});
  drawMarkers(canvas, points);
  return false;
}

/**
 * Image is right-clicked; pop point and redraw.
 */
function imageRightClicked(e) {
  points.pop();
  drawMarkers(canvas, points);
  return false;
}

/**
 * Load image to canvas based on index in imageset.
 */
function loadImageIndex(i) {
  var newImg = imageSet.images[i];
  console.log('name '+newImg.name);
  img.src = newImg.path;
  $('#imageTitle').text(newImg.task);
}

loadImageIndex(0);
