const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');
const flappyImg = new Image();
flappyImg.src = 'FlappyDunk.png';


//Game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 40;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// Score and hightscore variables

let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// We add a boolean variable
let scored = false;

// Let us control teh bird with SPACE

document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}


// Let us Resatrt the game
document.getElementById('restart-button').addEventListener('click', function(){
    hideEndMenu();
    resetGame();
    loop();
})


function increaseScore() {
    if (birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        socred = false;
    }
}

function collisionCheck() {
    // create bounding boxes for the bird and the pipes
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY 
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }
    
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
         return true;
        }

    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
         return true;
        }
 
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }
 

    return false;

}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('.backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('.backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}


// Reset the game total so we can start over again
function resetGame() {
     birdX = 50;
     birdY = 50;
     birdVelocity = 0;
     birdAcceleration = 0.1;

     pipeX = 400;
     pipeY = canvas.height - 200;

     score = 0;
}


function endGame() {
    showEndMenu();
}


function loop() {
    // reset teh ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy Bird
    ctx.drawImage(flappyImg, birdX, birdY); 

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // we would need to add an collision check to display our end-menu and end the game
    if (collisionCheck()) {
        endGame();
        return;
    }


    // Move the pipe
    pipeX -= 1.5;
    // if the pipe moves out of the frame we need to reset the pipe 
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }


    // apply gravity to the bird and let us move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;


    increaseScore();
    requestAnimationFrame(loop);
}

loop();