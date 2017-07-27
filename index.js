'use strict'

// Number of boxes
var BOXES_W = 20;
var BOXES_H = 20;
var BOX_SIZE_W = 30;
var BOX_SIZE_H = 30;

// Board width
var BOARD_WIDTH = BOXES_W * BOX_SIZE_W;
// Board height
var BOARD_HEIGHT = BOXES_H * BOX_SIZE_H;
// Padding
var PADDING = 0;
// Store the values of boxes in the grid
var grid = new Array(BOXES_W);
for (var i = 0; i < BOXES_H; i++) {
    grid[i] = new Array(BOXES_W);
}
// Game start or stop
var game_state = 0;


function drawBoard() {
    var context = $("#canvas")[0].getContext('2d');

    // Vertical lines
    for (var x = 0; x <= BOARD_WIDTH; x += BOX_SIZE_H) {
        context.moveTo(x + PADDING, PADDING);
        context.lineTo(x + PADDING, BOARD_HEIGHT + PADDING);
    }

    // Horizontal lines
    for (var x = 0; x <= BOARD_HEIGHT; x += BOX_SIZE_W) {
        context.moveTo(PADDING, x + PADDING);
        context.lineTo(BOARD_WIDTH + PADDING, x + PADDING);
    }

    context.strokeStyle = "black";
    context.stroke();
}


function toggleBox(x, y) {
    var context = $("#canvas")[0].getContext('2d');

    if (grid[x][y] === 1) {
        context.clearRect(x*BOX_SIZE_W + 1, y*BOX_SIZE_H + 1, BOX_SIZE_W-2, BOX_SIZE_H-2);
        grid[x][y] = 0;
    } else {
        context.fillRect(x*BOX_SIZE_W + 1, y*BOX_SIZE_H + 1, BOX_SIZE_W-2, BOX_SIZE_H-2);
        grid[x][y] = 1;
    }
}


function registerClick(event) {
    var x = event.offsetX;
    var y = event.offsetY;

    var pos_x = Math.floor(x / BOX_SIZE_W)
    var pos_y = Math.floor(y / BOX_SIZE_H)

    if (pos_x < BOXES_W && pos_y < BOXES_H) {
        toggleBox(pos_x, pos_y);
    }

    //console.log(liveNeighbourCount(pos_x, pos_y));
}


function startStop() {
    if (game_state === 0) {
        $("#startStop").html("Stop");
        game_state = 1;
    } else {
        $("#startStop").html("Start");
        game_state = 0;
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
            neighbours.push([x+1, y-1]);
        }
    }
    // Middle row
    if (x-1 >= 0) {
        neighbours.push([x-1, y]);
    }
    if (x+1 < BOXES_W) {
        neighbours.push([x+1, y]);
    }
    // Bottom row
    if (y+1 < BOXES_H) {
        if (x-1 >= 0) {
            neighbours.push([x-1, y+1]);
        }
            neighbours.push([x, y+1]);
        if (x+1 < BOXES_W) {
            neighbours.push([x+1, y+1]);
        }
    }

    return neighbours;
}


function liveNeighbourCount(x, y) {
    var neighbours = getNeighbours(x, y);
    var count = 0;

    for(var i = 0; i < neighbours.length; i++) {
        if (grid[ neighbours[i][0] ][ neighbours[i][1] ] === 1) {
            count++;
        }
    }

    return count;
}


function runEpoch() {

    // Prepare the new grid for the new Epoch
    // All boxes dead by default
    var new_grid = new Array(BOXES_W);
    for (var i = 0; i < BOXES_H; i++) {
        new_grid[i] = new Array(BOXES_W);
    }

    // For each box update the new grid
    for (var x = 0; x < BOXES_W; x++) {
        for (var y = 0; y < BOXES_H; y++) {
            var live_neighbours = liveNeighbourCount(x, y);
            var current_box_live;

            if (grid[x][y] === 1) {
                current_box_live = true;
            } else {
                current_box_live = false;
            }

            // Dead box with exactly three live neighbours becomes a live box
            if (!current_box_live) {
                if (live_neighbours === 3) {
                    new_grid[x][y] = 1;
                }
            } else {
                // Live box with two or three live neighbours lives
                if (live_neighbours === 2 || live_neighbours === 3) {
                    new_grid[x][y] = 1;
                }
            }
        }
    }

    // Set and redraw the new grid
    grid = new_grid;
    var context = $("#canvas")[0].getContext('2d');

    for (var x = 0; x < BOXES_W; x++) {
        for (var y = 0; y < BOXES_H; y++) {
            if (grid[x][y] === 1) {
                context.fillRect(x*BOX_SIZE_W + 1, y*BOX_SIZE_H + 1, BOX_SIZE_W-2, BOX_SIZE_H-2);
            } else {
                context.clearRect(x*BOX_SIZE_W + 1, y*BOX_SIZE_H + 1, BOX_SIZE_W-2, BOX_SIZE_H-2);
            }
        }
    }
}


$(document).ready( function() {
    drawBoard();

    // Call the runEpoch function every 0.1 second
    setInterval( function() {
        if (game_state === 1) {
            runEpoch();
        }
    }, 100);
});