// Select the canvas
const canvas = document.getElementById("myGame");
const context = canvas.getContext("2d");

// Set canvas size based on the device
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 400); // Max width 400px
    canvas.height = Math.min(window.innerHeight * 0.9, 600); // Max height 600px
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas); // Resize canvas when window resizes

// Draw rectangle function
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Computer paddle
const com = {
    x: canvas.width / 2 - 50 / 2,
    y: 10,
    width: 50,
    height: 10,
    color: "white",
    score: 0
};

// User Paddle
const user = {
    x: canvas.width / 2 - 50 / 2,
    y: canvas.height - 10 - 10,
    width: 50,
    height: 10,
    color: "white",
    score: 0
};

// Center line
function centerLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.strokeStyle = "white";
    context.stroke();
}

// Draw a Circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Create a ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 1,
    velocityX: 5,
    velocityY: 5,
    color: "white"
};

// Scores
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px josefin sans";
    context.fillText(text, x, y);
}

// Render the game
function render() {
    // Clear the canvas before rendering new frame
    drawRect(0, 0, canvas.width, canvas.height, "black");

    // Computer paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    // User paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // Center line
    centerLine();

    // Create a ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Scores of com and user
    drawText(com.score, 20, canvas.height / 2 - 30);
    drawText(user.score, 20, canvas.height / 2 + 50);
}

// Control the user paddle
canvas.addEventListener("mousemove", movepaddle);
canvas.addEventListener("touchmove", movepaddleTouch); // Touch control for mobile

// Mouse control for desktop
function movepaddle(e) {
    let rect = canvas.getBoundingClientRect();
    user.x = e.clientX - rect.left - user.width / 2;
}

// Touch control for mobile
function movepaddleTouch(e) {
    let rect = canvas.getBoundingClientRect();
    user.x = e.touches[0].clientX - rect.left - user.width / 2;
}

// Collision detection
function collision(b, p) { // b - ball, p - player
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return p.right > b.left && p.left < b.right && b.bottom > p.top && b.top < p.bottom;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 1;
    ball.velocityY = -ball.velocityY;
}

// Game over function
function ShowGameOver() {
    canvas.style.display = "none";
    const can = document.getElementById("can");
    can.style.display = "none";
    const result = document.getElementById("result");
    result.style.display = "block";
}

// Funny pop-up messages for Navya
const funnyPopups = [
    "Chalo khel shuru krte he Navya?", 
    "Navya,5 futiyaa!", 
    "Chal chal saatvi fail, Navya?", 
    "Ab tu pitegi Navya", 
    "Ping pong master in the house!", 
    "Sherrrr hi khde Navya", 
    "Rajasthan me paani khatam", 
    "Maarno pad jaago!", 
    "Abhi btata hu ruk ?", 
    "Game on, Navya!"
];

// Show a random funny pop-up message
function showFunnyPopUp() {
    const randomIndex = Math.floor(Math.random() * funnyPopups.length);
    const popupMessage = funnyPopups[randomIndex];

    // Create pop-up div
    const popupDiv = document.createElement("div");
    popupDiv.innerText = popupMessage;
    popupDiv.style.position = "absolute";
    popupDiv.style.top = `${Math.random() * 80 + 10}%`;
    popupDiv.style.left = `${Math.random() * 80 + 10}%`;
    popupDiv.style.backgroundColor = "#ffeb3b";
    popupDiv.style.color = "#000";
    popupDiv.style.padding = "10px";
    popupDiv.style.borderRadius = "5px";
    popupDiv.style.fontFamily = "'Courier New', Courier, monospace";
    popupDiv.style.fontSize = "18px";
    popupDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    document.body.appendChild(popupDiv);

    // Remove pop-up after 3 seconds
    setTimeout(() => {
        popupDiv.remove();
    }, 3000);
}

// Trigger funny pop-ups randomly
function randomFunnyPopUp() {
    const randomTime = Math.floor(Math.random() * 5000) + 5000; // Random time between 5-10 seconds
    setTimeout(() => {
        showFunnyPopUp();
        randomFunnyPopUp();
    }, randomTime);
}

// Update function
function update() {
    ball.x += ball.velocityX * ball.speed;
    ball.y += ball.velocityY * ball.speed;

    let computerLevel = 0.1;
    com.x += (ball.x - (com.x + com.width / 2)) * computerLevel;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
    }

    let player = (ball.y < canvas.height / 2) ? com : user;
    if (collision(ball, player)) {
        ball.velocityY = -ball.velocityY;
        ball.speed += 0.1;
    }

    if (ball.y - ball.radius < 0) {
        user.score++;
        resetBall();
    } else if (ball.y + ball.radius > canvas.height) {
        com.score++;
        resetBall();
    }

    if (user.score > 4 || com.score > 4) {
        clearInterval(loop);
        ShowGameOver();
    }
}

// Start the game
function start() {
    update();
    render();
}

// Game loop
const loop = setInterval(start, 1000 / 50);

// Trigger random pop-ups when game starts
randomFunnyPopUp();
