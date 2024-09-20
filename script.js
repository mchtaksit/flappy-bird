//canvas
// var main = document.getElementById("main");
// var draw = main.getContext("2d");
// draw.beginPath();
// draw.moveTo(0, 0);
// draw.lineTo(100, 100);
// draw.stroke();


// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdimg;

let bird = {
	x: birdX,
	y: birdY,
	width: birdWidth,
	height: birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let topPipeY = 0;


let topPipeImg;
let bottomPipeImg;


//physics
let velocityX = -2;//pipes speed
let velocityY = 0;//bird jump speed
let gravity = 0.2;

let gameOver = false;

let score = 0;

window.onload = function () {
	board = document.getElementById("board");
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext("2d");


	// load images
	birdimg = new Image();
	birdimg.src = "images/flappybird.png";
	birdimg.onload = function () {
		context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
	}
	topPipeImg = new Image();
	topPipeImg.src = "images/toppipe.png";

	bottomPipeImg = new Image();
	bottomPipeImg.src = "images/bottompipe.png";

	requestAnimationFrame(update);
	setInterval(placePipes, 1500);
	document.addEventListener("keydown", moveBird);
}


function update() {
	requestAnimationFrame(update);
	if (gameOver) {
		return;
	}
	context.clearRect(0, 0, board.width, board.height);

	// bird
	velocityY += gravity;
	bird.y = Math.max(bird.y + velocityY, 0);
	context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

	if (bird.y > board.height) {
		gameOver = true;
	}
	//pipes
	for (let i = 0; i < pipeArray.length; i++) {
		let pipe = pipeArray[i];
		pipe.x += velocityX;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

		if (!pipe.passed && bird.x > pipe.x + pipe.width) {
			score += 0.5;
			pipe.passed = true;
		}


		if (detectCollision(bird, pipe)) {
			gameOver = true;
		}

	}

	//claer pipes

	while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
		pipeArray.shift();
	}

	let gameOverText = "Game Over";

	//score
	context.fillStyle = "white";
	context.font = "45px sans-serif"
	context.fillText(score, 170, 45);
	if (gameOver) {
		context.fillText(gameOverText, 65, 100);
	}
}


function placePipes() {
	function getRandomNumber() {
		return Math.floor(Math.random() * (4 - 2 + 1)) + 2;
	}

	let randomPipeY = topPipeY - pipeHeight / 4 - pipeHeight / getRandomNumber();
	console.log(randomPipeY);
	let topPipe = {
		img: topPipeImg,
		x: pipeX,
		y: randomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	}
	let randomBottomPipeY = randomPipeY + 680;
	let bottomPipe = {
		img: bottomPipeImg,
		x: pipeX,
		y: randomBottomPipeY,
		width: pipeWidth,
		height: pipeHeight,
		passed: false
	}

	pipeArray.push(topPipe);
	pipeArray.push(bottomPipe);
}
document.addEventListener("click", moveBird);
function moveBird(e) {
	if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type === "click") {
		velocityY = -6;
	}
}

function detectCollision(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}