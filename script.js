const BG_COLOR = '#DAD294';
const SNAKE_COLOR = '#E53935';
const FOOD_COLOR = '#456596';

const canvas = document.getElementById("canvas");
canvas.width = canvas.height = 600;
const ct = canvas.getContext("2d");

// SCREEN

const frameRate = 10;
const screenSize = 20;
const tile = canvas.width / screenSize;

// IMPORTANT VARIABLES

let pos, velocity, food, snake;

function init() {
  pos = { x: 8, y: 10 };
  velocity = { x: 0, y: 0 };

  snake = [
    { x: 6, y: 10},
    { x: 7, y: 10},
    { x: 8, y: 10},
  ];

  randomFood();
}

init();

function randomFood() {
  
  food = {
    x: Math.floor(Math.random() * tile),
    y: Math.floor(Math.random() * tile)
  };

  for (let cell of snake) {
    if (food.x === cell.x && food.y === cell.y) {
      return randomFood();
    }
  }
}

document.addEventListener("keydown", keydown);

function keydown(e) {
  switch (e.keyCode) {
    case 37:
      return velocity = { x: -1, y: 0 }
    case 38:
      return velocity = { x: 0, y: -1 }
    case 39:
      return velocity = { x: 1, y: 0 }
    case 40:
      return velocity = { x: 0, y: 1 }
  }

}

// GAME LOOP

function gameLoop() {
  ct.fillStyle = BG_COLOR;
  ct.clearRect(0, 0, canvas.width, canvas.height);
  ct.fillRect(0, 0, canvas.width, canvas.height);


  ct.fillStyle = FOOD_COLOR;
  ct.fillRect(food.x * screenSize, food.y * screenSize, screenSize, screenSize);

  ct.fillStyle = SNAKE_COLOR;
  for (let cell of snake) {
    ct.fillRect(cell.x * screenSize, cell.y * screenSize, screenSize, screenSize);
  }

  pos.x += velocity.x;
  pos.y += velocity.y;

  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.push({...pos});
    pos.x += velocity.x;
    pos.y += velocity.y;
    randomFood();
  }
  
  if (velocity.x || velocity.y) {
    for (let cell of snake) {
      let outboundery = cell.x >= canvas.width / screenSize || cell.x < 0 || cell.y < 0 || cell.y >= canvas.height / screenSize;
      if (cell.x === pos.x && cell.y === pos.y || outboundery) {
        return init();
      }
    }
    snake.push({...pos});
    snake.shift();
  }
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
  console.log("X: ", snake[0].x, "Y: ", snake[0].y)
}, 1000 / frameRate)