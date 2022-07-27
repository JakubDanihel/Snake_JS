//nastavenie premennych
const hernaPlocha = document.querySelector("#hraHranica");
const ctx = hernaPlocha.getContext("2d");
const skoreTxt = document.querySelector("#skoreTxt");
const resetBtn = document.querySelector("#resetBtn");

//konstatne hodnoty z html
const gameWidth = hernaPlocha.width;
const gameHeight = hernaPlocha.height;
const hadHranica = "lightgreen";
const plochaFarba = "black";
const hadFarba = "green";
const foodFarba = "red";

//rychlost - cim vyssia tym pomalsie ide had
const speed = 100;

//velkost jednotiek
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;

let foodX;
let FoodY;

let skore = 0;

let snake = [
    {x: unitSize*4, y: 0},
    {x: unitSize*3, y: 0},
    {x: unitSize*2, y: 0},
    {x: unitSize*1, y: 0},
    {x: 0, y: 0}
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

//spustenie kodu
gameStart();


//funkcie
//funkcia pre zaciatok
function gameStart(){

    running = true;
    skoreTxt.textContent = skore;

    createFood();
    drawFood();
    drawSnake();
    nextTick();
};

//herny casovac
function nextTick(){
    if(running){
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, speed)
    }
    else{
        displayGameOver();
    }
};

//tvorba pozadia
function clearBoard(){
    ctx.fillStyle = plochaFarba;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

//vytvorenie jedla
function createFood(){
    //tvorba koordinatov x a y
    function randomFood(min, max) {
        const randomNumber = Math.floor((Math.random() * (max - min) + min)/unitSize)*unitSize;
        return randomNumber;
    }

    //zadanie koordinatov x a y pre jedlo
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
};

//vyobrazenie jedla
function drawFood(){
    ctx.fillStyle = foodFarba;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

//vyobrazenie hada
function drawSnake(){
    ctx.fillStyle = hadFarba;
    ctx.strokeStyle = hadHranica;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
};

//pohnutie hada
function moveSnake(){
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);

    //pokial je had zie jedlo
    if(snake[0].x == foodX && snake[0].y == foodY){
        skore++;
        skoreTxt.textContent = skore;
        createFood();
    }else{
        snake.pop();
    }
};

//zmena smeru pohybu hada
function changeDirection(event){
    const keyPresed = event.keyCode;
    
    //kazda klavesa ma svoju hodnotu, toto sa ulozi
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    //booleanske hodnoty pre pohyb hada
    const goingUP = (yVelocity == -unitSize);
    const goingDOWN = (yVelocity == unitSize);
    const goingLEFT = (xVelocity == -unitSize);
    const goingRIGHT = (xVelocity == unitSize);

    //urcenie pophybu hada
    switch(true){
        case (keyPresed == LEFT && !goingRIGHT):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;

        case (keyPresed == RIGHT && !goingLEFT):
            xVelocity = unitSize;
            yVelocity = 0;
            break;

        case (keyPresed == UP && !goingDOWN):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;

        case (keyPresed == DOWN && !goingUP):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

//overenie konca hry, kolize atd
function checkGameOver(){
    //narazenie o hranu
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;

        case (snake[0].x >= gameWidth):
            running = false;
            break;

        case (snake[0].y < 0):
            running = false;
            break;

        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }

    //zahryznutie o telo
    for(let i = 1; i<snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};

//vyobrazenie konca hry
function displayGameOver(){
    ctx.font = "50px Ink Free";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Koniec Hry", gameWidth/2, gameHeight/2);
    running = false;
};

//reset hry
function resetGame(){
    skore = 0;
    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        {x: unitSize*4, y: 0},
        {x: unitSize*3, y: 0},
        {x: unitSize*2, y: 0},
        {x: unitSize*1, y: 0},
        {x: 0, y: 0}
    ]

    gameStart();
};