/* globals $ document */
//  add an apple for snek to eat
//  grow snake when it touches the apple
//  handle snake longer than 1
//  stop snek backing up on itself

// Helper functions
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
function getcell(row, col) {
  const $game = $('#game');
  const $rows = $game.find('.row');
  const $row = $($rows[row]);
  const $cells = $row.find('.cell');
  const $cell = $($cells[col]);
  return $cell;
}
let DIRECTION = 'DOWN';
const $gameover = $('#gameover');
const $instructions = $('#instructions');
$instructions.html('Use Arrow Keys to Move. Use R key to reset');

// Snake
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// calling a constructor
// 1. creates a new object {}
// 2. run the innards of you constructor function with that new object set to "this"
// 3. return "this" aka that object you just created
function Snake(grid) {
  // sets 'this' to a new object
  // var this = {};
  this.grid = grid;
  this.pos = [
    [2, 0],
    [1, 0],
    [0, 0],
  ];
  this.dir = 'DOWN';
}

Snake.prototype.draw = function draw() {
  const $cells = $('.cell');
  $cells.removeClass('snake');
  $cells.removeClass('snake-head');
  let $cell = getcell(this.pos[0][0], this.pos[0][1]);
  $cell.addClass('snake-head');
  for (let i = 1; i < this.pos.length; i += 1) {
    $cell = getcell(this.pos[i][0], this.pos[i][1]);
    $cell.addClass('snake');
  }
};

Snake.prototype.checkValid = function checkValid() {
  let valid = true;
  valid = valid && this.pos[0][0] >= 0 && this.pos[0][0] < 10;
  valid = valid && this.pos[0][1] >= 0 && this.pos[0][1] < 10;
  for (let i = 1; i < this.pos.length; i += 1) {
    if (this.pos[0][0] === this.pos[i][0] && this.pos[0][1] === this.pos[i][1]) {
      valid = false;
    }
  }
  return valid;
};

Snake.prototype.right = function right(apple) {
  const newhead = [this.pos[0][0], this.pos[0][1] + 1];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    this.grid.addApple();
  }
};

Snake.prototype.left = function left(apple) {
  const newhead = [this.pos[0][0], this.pos[0][1] - 1];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    this.grid.addApple();
  }
};

Snake.prototype.down = function down(apple) {
  const newhead = [this.pos[0][0] + 1, this.pos[0][1]];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    this.grid.addApple();
  }
};

Snake.prototype.up = function up(apple) {
  const newhead = [this.pos[0][0] - 1, this.pos[0][1]];
  this.pos.unshift(newhead);
  if (!(this.pos[0][0] === apple.pos[0] && this.pos[0][1] === apple.pos[1])) {
    this.pos.pop();
  } else {
    this.grid.addApple();
  }
};

// Apple
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
function Apple(coord) {
  this.pos = coord;
}

Apple.prototype.draw = function draw() {
  const $cells = $('.cell');
  $cells.removeClass('apple');
  const $cell = getcell(this.pos[0], this.pos[1]);
  $cell.addClass('apple');
};

// Grid
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
function Grid() {
  this.width = 10;
  this.height = 10;
  this.snake = new Snake(this);
  this.addApple();
}

Grid.prototype.isWon = function isWon() {
  return this.snake.pos.length === this.width * this.height;
};

Grid.prototype.addApple = function addApple() {
  const possibleCoords = [];
  for (let i = 0; i < this.width; i += 1) {
    for (let j = 0; j < this.height; j += 1) {
      if (!this.isCoordInSnake(j, i)) {
        possibleCoords.push([j, i]);
      }
    }
  }

  if (possibleCoords.length === 0) {
    return;
  }

  const appleCoord = possibleCoords[Math.floor(Math.random() * possibleCoords.length)];
  this.apple = new Apple(appleCoord);
};

Grid.prototype.isCoordInSnake = function isCoordInSnake(row, col) {
  return !!this.snake.pos.find(coord => coord[0] === row && coord[1] === col);
};

Grid.prototype.draw = function draw() {
  this.apple.draw();
  this.snake.draw();
};
const ALL_INTERVAL_IDS = [];
function clearAllIntervals() {
  while (ALL_INTERVAL_IDS.length) {
    clearInterval(ALL_INTERVAL_IDS.pop());
  }
}

function gameLoop() {
  const grid = new Grid();
  ALL_INTERVAL_IDS.push(setInterval(() => {
    const { snake, apple } = grid;
    switch (DIRECTION) {
      case 'LEFT': {
        if (snake.dir === 'RIGHT') {
          snake.right(apple);
          break;
        }
        snake.left(apple);
        snake.dir = 'LEFT';
        break;
      }
      case 'RIGHT': {
        if (snake.dir === 'LEFT') {
          snake.left(apple);
          break;
        }
        snake.dir = 'RIGHT';
        snake.right(apple);
        break;
      }
      case 'UP': {
        if (snake.dir === 'DOWN') {
          snake.down(apple);
          break;
        }
        snake.dir = 'UP';
        snake.up(apple);
        break;
      }
      case 'DOWN': {
        if (snake.dir === 'UP') {
          snake.up(apple);
          break;
        }
        snake.dir = 'DOWN';
        snake.down(apple);
        break;
      }
      default:
    }
    if (snake.checkValid()) {
      grid.draw();
      if (grid.isWon()) {
        clearAllIntervals();
        $gameover.html('U win!');
      }
    } else {
      $gameover.html('Gameover!');
      clearAllIntervals();
    }
  }, 125));
}

function reset() {
  clearAllIntervals();
  $gameover.html('');
  DIRECTION = 'DOWN';

  gameLoop();
}

// Controls
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
$(document).keydown((event) => {
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
    case 82:
      // console.log('reset');
      reset();
      break;
    default:
  }
  // console.log(DIRECTION);
  // console.log(event.keyCode);
});

// Game loop
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////
// //////////////////////////////////////////////

gameLoop();
