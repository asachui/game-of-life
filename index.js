'use strict'

// Number of boxes
var BOXES_W = 20;
var BOXES_H = 20;
var BOX_SIZE_W = 30;
var BOX_SIZE_H = 30;

// Board width
var bw = BOXES_W * BOX_SIZE_W;
// Board height
var bh = BOXES_H * BOX_SIZE_H;
// Padding
var p = 0;
// Store the values of boxes
var arr = new Array(BOXES_W);
for (var i = 0; i < BOXES_H; i++) {
  arr[i] = new Array(BOXES_W);
}
// Game start or stop
var gameState = 0;

function drawBoard() {
	var context = $("#canvas")[0].getContext('2d');

	for (var x = 0; x <= bw; x += BOX_SIZE_H) {
    context.moveTo(x + p, p);
    context.lineTo(x + p, bh + p);
	}

	for (var x = 0; x <= bh; x += BOX_SIZE_W) {
    context.moveTo(p, x + p);
    context.lineTo(bw + p, x + p);
	}

	context.strokeStyle = "black";
	context.stroke();
}


function toggleBox(x, y) {
  var context = $("#canvas")[0].getContext('2d');

  if (arr[x][y] === 1) {
    context.clearRect(x*BOX_SIZE_W + 1, y*BOX_SIZE_H + 1, BOX_SIZE_W-2, BOX_SIZE_H-2);
    arr[x][y] = 0;
  } else {
    context.fillRect(x*BOX_SIZE_W + 1, y*BOX_SIZE_H + 1, BOX_SIZE_W-2, BOX_SIZE_H-2);
    arr[x][y] = 1;
  }
}


function registerClick(event) {
  var x = event.offsetX;
  var y = event.offsetY;
  //console.log("x coords: " + x + ", y coords: " + y);

  var posX = Math.floor(x / BOX_SIZE_W)
  var posY = Math.floor(y / BOX_SIZE_H)
  //console.log("x pos: " + posX + ", y pos: " + posY);

  toggleBox(posX, posY);

  console.log(getNeighbours(posX, posY));
}


function startStop() {
  if (gameState === 0) {
    $("#startStop").html("Stop");
    gameState = 1;
  } else {
    $("#startStop").html("Start");
    gameState = 0;
  }
}


function getNeighbours(x, y) {
  var neighbours = [];

  // Top row
  if (y-1 >= 0) {
    if (x-1 >= 0) {
      neighbours.push([x-1, y-1]);
    }
    neighbours.push([x, y-1]);
    if (x+1 < BOXES_W) {
      neighbours.push([x+1, y-1])
    }
  }
  // Middle row
  if (x-1 >= 0) {
    neighbours.push([x-1, y])
  }
  if (x+1 < BOXES_W) {
    neighbours.push([x+1, y])
  }
  // Bottom row
  if (y+1 < BOXES_H) {
    if (x-1 >= 0) {
      neighbours.push([x-1, y+1]);
    }
    neighbours.push([x, y+1]);
    if (x+1 < BOXES_W) {
      neighbours.push([x+1, y+1])
    }
  }

  return neighbours;
}


function runEpoch() {
  console.log("Epoch!");
}


$(document).ready( function() {
	drawBoard();

  setInterval(function(){
    if (gameState === 1) {
      runEpoch();
    }
  }, 2000);
});