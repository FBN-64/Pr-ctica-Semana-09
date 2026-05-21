// Configuración inicial del Canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Estado del juego
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0; // Dirección horizontal
let dy = 0; // Dirección vertical
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

highScoreElement.textContent = highScore;

// Escuchar controles
document.addEventListener("keydown", changeDirection);

// Iniciar el bucle del juego
let gameInterval = setInterval(gameLoop, 100);

function gameLoop() {
    update();
    draw();
}

function update() {
    // 1. Mover la serpiente
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Solo mover si el juego ha empezado (dx o dy != 0)
    if (dx !== 0 || dy !== 0) {
        snake.unshift(head);

        // 2. Comprobar si comió
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop(); // Quitar la cola si no comió
        }
    }

    // 3. Comprobar colisiones (Paredes o cuerpo)
    if (checkGameOver()) {
        resetGame();
    }
}

function draw() {
    // Limpiar fondo
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar comida
    ctx.fillStyle = "#ff5722";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff5722";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Dibujar serpiente
    ctx.shadowBlur = 0;
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#81c784" : "#4caf50";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function changeDirection(event) {
    const key = event.keyCode;
    const LEFT = 37, A = 65;
    const UP = 38, W = 87;
    const RIGHT = 39, D = 68;
    const DOWN = 40, S = 83;

    if ((key === LEFT || key === A) && dx !== 1) { dx = -1; dy = 0; }
    if ((key === UP || key === W) && dy !== 1) { dx = 0; dy = -1; }
    if ((key === RIGHT || key === D) && dx !== -1) { dx = 1; dy = 0; }
    if ((key === DOWN || key === S) && dy !== -1) { dx = 0; dy = 1; }
}

function checkGameOver() {
    const head = snake[0];
    
    // Colisión con paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;

    // Colisión con cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Evitar que la comida salga sobre la serpiente
    if (snake.some(part => part.x === food.x && part.y === food.y)) generateFood();
}

function resetGame() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreElement.textContent = highScore;
    }
    alert("Game Over. Puntuación: " + score);
    snake = [{ x: 10, y: 10 }];
    dx = 0; dy = 0;
    score = 0;
    scoreElement.textContent = score;
}