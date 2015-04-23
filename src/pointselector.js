var canvas = document.getElementById('imageCanvas');
canvas.onclick = imageClicked;
canvas.oncontextmenu = imageRightClicked;

var rectW = 20, rectH = 20;
var currentImageIndex = -1;

// Logic for mouse button events
var mie = false; // TODO: check browser for internet explorer?
var left, right;
left = mie ? 1 : 0;
right = 2;

var img = new Image();
img.onload = function() {
  canvas.getContext('2d').drawImage(img, 0, 0);
};

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
 * Draw markers on the canvas corresponding to click points on the current image.
 */
function drawMarkers(canvas) {
  var points = imageSet.images[currentImageIndex].points;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  
  for (var i = 0; i < points.length; i++) {
    drawMarker(ctx, points[i]);
  } 
  drawPointList();
}   

/**
 * Add to DOM a list corresponding to click points on the current image.
 */
function drawPointList(points) {
  var points = imageSet.images[currentImageIndex].points;
  var dataString = '';
  var dataStringArray = [];
   
  $('#pointlistDiv ul').html('');
  
  points.forEach(function(p) {
    
    // dataString for each point is "<imageName>, x, y"
    dataString = imageSet.images[currentImageIndex].name + ', '+p.x+', '+p.y;
    dataStringArray.push(dataString);
    
    var newPointLi = '<li>' + dataString + '</li>';
    $('#pointlistDiv ul').append(newPointLi);
  });
  
  //writePointData(dataStringArray);
}  

function writePointData(data) {
  var csvContent = "data:text/csv;charset=utf-8," + data.join('\n');
  
  // Save
  //window.open(encodeURI(csvContent));
  
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.csv");
  link.click(); // 'click' the link to trigger download
}
    
/**
 * When the image is clicked; keep track of that point in a data structure
 * associated with the current image, then redraw.
 */
function imageClicked(e) {
  var points = imageSet.images[currentImageIndex].points;
  var mousePos = getMousePos(canvas, e);
  points.push({'x': mousePos.x, 'y': mousePos.y});
  drawMarkers(canvas);
  return false;
}

/**
 * Image is right-clicked; pop point and redraw.
 */
function imageRightClicked(e) {
  var points = imageSet.images[currentImageIndex].points;
  points.pop();
  drawMarkers(canvas, points);
  return false;
}

/**
 * Load image to canvas based on index in imageset.
 */
function loadImageIndex(i) {
  if (imageSet.images.length === 0 || i < 0 || i >= imageSet.images.length) {
    console.log('Error: loadImageIndex requires valid image index '
      + 'as argument: given \''+i+'\', array length is '+imageSet.images.length);
      
    // If off-by-one error at the end of the non-empty images array (e.g., trying to increment
    // the last valid index), decrement the currentImageIndex to fail gracefully.
    if (i === imageSet.images.length && imageSet.images.length > 0) {
      currentImageIndex--;
    }  
    return false;
  }
  var newImg = imageSet.images[i];
  
  // Augment the imageSet data with a new array for clicks on this image
  imageSet.images[i].points = [];
  
  console.log('name '+newImg.name);
  img.src = newImg.path;
  $('#imageCounterTitle').text((i+1)+'/'+imageSet.images.length);
  $('#imageTask').text(imageSet.images[i].task);
}

/* Set up event handlers ---------------------------- */

$('#nextImgAnchor').click(function() {
  loadImageIndex(++currentImageIndex);
  drawMarkers(canvas);
});

$('#downloadAnchor').click(function() {
  loadImageIndex(++currentImageIndex);
});

/* Load initial image if there is one --------------- */

if (imageSet.images.length > 0) {
  // Start with first image in array
  currentImageIndex = 0;
  loadImageIndex(currentImageIndex);
}
