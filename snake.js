//  add an apple for snek to eat
//  grow snake when it touches the apple
//  handle snake longer than 1
//  stop snek backing up on itself

// Helper functions
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
function getcell (row, col) {
  var $game = $('#game');
  var $rows = $game.find('.row');
  var $row = $($rows[row]);
  var $cells = $row.find('.cell');
  var $cell = $($cells[col]);
  return $cell;
}

// Snake
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// calling a constructor
// 1. creates a new object {}
// 2. run the innards of you constructor function with that new object set to "this"
// 3. return "this" aka that object you just created
function Snake () {
  // sets 'this' to a new object
  // var this = {};
  this.pos = [
    [2, 0],
    [1, 0],
    [0, 0]
  ];
  this.dir = 'DOWN';
}

Snake.prototype.draw = function () {
  var $cells = $('.cell');
  $cells.removeClass('snake');
  $cells.removeClass('snake-head');
  $cell = getcell(this.pos[0][0], this.pos[0][1]);
  $cell.addClass('snake-head');
  for (var i = 1; i < this.pos.length; i++) {
    var $cell = getcell(this.pos[i][0], this.pos[i][1]);
    $cell.addClass('snake');
  }
};
Snake.prototype.checkValid = function () {
  var valid = true;
  valid = valid && this.pos[0][0] >= 0 && this.pos[0][0] < 5;
  valid = valid && this.pos[0][1] >= 0 && this.pos[0][1] < 5;
  for (var i = 1; i < this.pos.length; i++) {
    if (this.pos[0][0] === this.pos[i][0] && this.pos[0][1] === this.pos[i][1]) {
      valid = false;
    }
  }
  return valid;
};

Snake.prototype.right = function (apple) {
  var newhead = [this.pos[0][0], this.pos[0][1] + 1];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    grid.addApple();
  }
};

Snake.prototype.left = function (apple) {
  var newhead = [this.pos[0][0], this.pos[0][1] - 1];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    grid.addApple();
  }
};

Snake.prototype.down = function (apple) {
  var newhead = [this.pos[0][0] + 1, this.pos[0][1]];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    grid.addApple();
  }
};

Snake.prototype.up = function (apple) {
  var newhead = [this.pos[0][0] - 1, this.pos[0][1]];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    grid.addApple();
  }
};

// Apple
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
function Apple (coord) {
  this.pos = coord;
}

Apple.prototype.draw = function () {
  var $cells = $('.cell');
  $cells.removeClass('apple');
  var $cell = getcell(this.pos[0], this.pos[1]);
  $cell.addClass('apple');
};

// Grid
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
function Grid () {
  this.width = 5;
  this.height = 5;
  this.snake = new Snake();
  this.addApple();
}

Grid.prototype.isWon = function () {
  return this.snake.pos.length === this.width * this.height;
};

Grid.prototype.addApple = function () {
  var possibleCoords = [];
  for (var i = 0; i < this.width; i++) {
    for (var j = 0; j < this.height; j++) {
      if (!this.isCoordInSnake(j, i)) {
        possibleCoords.push([j, i]);
      }
    }
  }

  if (possibleCoords.length === 0) {
    return;
  }

  var appleCoord = possibleCoords[Math.floor(Math.random() * possibleCoords.length)];
  this.apple = new Apple(appleCoord);
};

Grid.prototype.isCoordInSnake = function (row, col) {
  return !!this.snake.pos.find(function (coord) {
    return coord[0] === row && coord[1] === col;
  });
};

Grid.prototype.draw = function () {
  this.apple.draw();
  this.snake.draw();
};

// Controls
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
var DIRECTION = 'DOWN';
$(document).keydown(function (event) {
  switch (event.keyCode) {
    case 37:
      DIRECTION = 'LEFT';
      break;
    case 38:
      DIRECTION = 'UP';
      break;
    case 39:
      DIRECTION = 'RIGHT';
      break;
    case 40:
      DIRECTION = 'DOWN';
      break;
    default:
      return;
  }
  event.preventDefault();
  console.log(DIRECTION);
  console.log(event.keyCode);
});

// Game loop
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
var grid = new Grid();
grid.draw();

var movement = setInterval(function () {
  var snake = grid.snake;
  var apple = grid.apple;

  switch (DIRECTION) {
    case 'LEFT':
      if (snake.dir === 'RIGHT') {
        snake.right(apple);
        break;
      }
      snake.left(apple);
      snake.dir = 'LEFT';
      break;
    case 'RIGHT':
      if (snake.dir === 'LEFT') {
        snake.left(apple);
        break;
      }
      snake.dir = 'RIGHT';
      snake.right(apple);
      break;
    case 'UP':
      if (snake.dir === 'DOWN') {
        snake.down(apple);
        break;
      }
      snake.dir = 'UP';
      snake.up(apple);
      break;
    case 'DOWN':
      if (snake.dir === 'UP') {
        snake.up(apple);
        break;
      }
      snake.dir = 'DOWN';
      snake.down(apple);
      break;
    default:
  }
  if (snake.checkValid()) {
    grid.draw();
    if (grid.isWon()) {
      clearInterval(movement);
      $('#gameover').append('U win!');
    }
  } else {
    clearInterval(movement);
    $('#gameover').append('Gameover!');
  }
}, 250);
