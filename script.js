const car = document.querySelector('.car');
const road = document.querySelector('.road');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.createElement('div');

let carPositionX = road.offsetWidth / 2 - car.offsetWidth / 2;
let obstacleSpeed = 10;
let isGameOver = false;
let score = 0;
let obstacles = [];

// Create the score element
scoreElement.id = 'score';
scoreElement.innerText = `Score: ${score}`;
gameContainer.appendChild(scoreElement);

function createObstacle(className) {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle', className);

    const hitbox = document.createElement('div');
    hitbox.classList.add('hitbox');
    obstacle.appendChild(hitbox);

    gameContainer.appendChild(obstacle);
    obstacles.push({ element: obstacle, positionY: -120 });
}

function positionObstacles() {
    const positions = [];

    obstacles.forEach(obstacleObj => {
        let positionX;
        do {
            positionX = Math.random() * (road.offsetWidth - obstacleObj.element.offsetWidth) + road.offsetLeft;
        } while (positions.some(pos => Math.abs(pos - positionX) < 80)); // Ensures obstacles are not too close

        positions.push(positionX);
        obstacleObj.element.style.left = `${positionX}px`;
        obstacleObj.positionY = -120; // Reset position
        obstacleObj.element.style.top = '-120px'; // Reset visual position
    });
}

function moveObstacles() {
    if (isGameOver) return;

    obstacles.forEach((obstacleObj) => {
        obstacleObj.positionY += obstacleSpeed;

        if (obstacleObj.positionY > window.innerHeight) {
            positionObstacles(); // Reset position if off-screen
            increaseScore(); // Increase score when an obstacle passes
        }

        obstacleObj.element.style.top = `${obstacleObj.positionY}px`;
        checkCollision(obstacleObj.element.querySelector('.hitbox'));
    });

    requestAnimationFrame(moveObstacles);
}

function checkCollision(obstacleHitbox) {
    const carHitbox = car.querySelector('.hitbox');
    const carRect = carHitbox.getBoundingClientRect();
    const obstacleRect = obstacleHitbox.getBoundingClientRect();

    if (
        carRect.left < obstacleRect.left + obstacleRect.width &&
        carRect.left + carRect.width > obstacleRect.left &&
        carRect.top < obstacleRect.top + obstacleRect.height &&
        carRect.height + carRect.top > obstacleRect.top
    ) {
        isGameOver = true;
        alert('Game Over! Tap to restart.');
        restartGame();
    }
}

function increaseScore() {
    score += 1;
    scoreElement.innerText = `Score: ${score}`;
}

function restartGame() {
    carPositionX = road.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.left = `${carPositionX}px`;

    positionObstacles(); // Reposition obstacles
    obstacleSpeed = 5; // Reset obstacle speed to default
    score = 0;
    scoreElement.innerText = `Score: ${score}`;

    isGameOver = false;
    moveObstacles(); // Restart obstacle movement
}

// Move car on swipe or touch
road.addEventListener('touchmove', (e) => {
    if (isGameOver) return;

    const touch = e.touches[0];
    const roadRect = road.getBoundingClientRect();
    carPositionX = touch.clientX - roadRect.left - car.offsetWidth / 2;

    if (carPositionX < 0) carPositionX = 0;
    if (carPositionX > roadRect.width - car.offsetWidth) {
        carPositionX = roadRect.width - car.offsetWidth;
    }

    car.style.left = `${carPositionX}px`;
});

// Create two obstacles with different classes
createObstacle('obstacle1');
createObstacle('obstacle2');

// Position obstacles initially
positionObstacles();

// Start the game
moveObstacles();
