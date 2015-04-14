//
// Game.js
// useful description here
//


// 
// Global Variables
// 
var _UP    = 1;
var _DOWN  = 2;
var _LEFT  = 3;
var _RIGHT = 4;
var frames = 0;
var playerColor;
var players = [];
var powerups = [];


//
// Preload
//
function preload(){
  destroySound = loadSound('assets/boom.mp3');  // @timgormly freesound.org
  music = loadSound('assets/bkg.mp3');
  gameOverSound = loadSound('assets/gameover.mp3');

  if (S.soundOn == false){
    masterVolume(0);
  }
};


//
// Setup
//
function setup() {
  createCanvas(windowWidth, windowHeight);
  S.bgColor = color(0,0,0);
  background(S.bgColor);
  initGame(); //lets get going!

};



//
// initGame
//
function initGame(){

  players = []; // reset players array
  powerups = [];
  drawBackground();
  music.loop();

  //Generate players
  for (var i=0; i<S.numPlayers; i++) {
    // S.playerSize = round(random(2,40));
    playerColor = color(random(255),random(255),random(255));
    //S.playerSize = random(5,30);
    players.push(new bike(i, _LEFT, S.playerSize, playerColor, S.playerLength)); //playerID, dir, bikeSz, color, num segments
     // players[i].setControls('w','s','a','d');
  }
  players[0].setControls('w','s','a','d');
  players[1].setControls('i','k','j','l');

  // player1 is hot pink human 
  players[0].ai = false;
  players[0].color = color(255,0,255);

  // player2 is white human 
  players[1].ai = false;
  players[1].color = color(255,255,255);

  draw(true);
  draw(true);

  console.log('Game starts in 5 seconds...');
  setTimeout(function(){
    S.gameStarted = true;
  }, 5000);

};


//
// drawBackground
//
function drawBackground(c, message){
  c = c || S.bgColor;
  if (S.clearBG == true){
    background(c);
  }
  if (message){
    console.log('message:', message );
    background(c);
    //invert the color of the winner
    var messageColor = color(255-red(c), 255-green(c), 255-blue(c)); 
    textPopUp(message, messageColor);
  }

};


//
// gameOver
//
function gameOver(){
  var alive = [];
  for(var i=0; i<players.length; i++){
    if (players[i] != null) alive.push(players[i]);
  }
  
  var player = alive[0];
  var isGameOver = (alive.length > 1) ? false : true;

  //look at the last player standing and get player ID for a winner popup and set background color to thier color.
  if(isGameOver){
    console.log('Game Over');
    music.stop(); //stop the music when everyone dies.
    if (player){
      var msg = "Player " + player.playerID + " Wins!";
      drawBackground(player.color, msg);
    } else {
      drawBackground(S.bgColor, "Draw!");
    }
  }

  return isGameOver;

};


//
// Draw
//
function draw(init) {

  if (S.gameStarted == false && !init) return;

  //handle game over
  if (gameOver()) {
    S.gameStarted = false;
    gameOverSound.play();
    setTimeout(function(){
      initGame();
    }, 2000);
  }

  frames++;

  //handle movement at the normal framerate
  for(var i=0; i<players.length; i++){
    if (players[i] == null) continue;
    players[i].setDirection();
    players[i].setDirection();
  }

  //render bikes to screen
  if (frames % S.drawFrame != 0) return;

  drawBackground();

	for (var i=0; i<players.length; i++) {
    if (players[i] == null) continue;
    if (players[i].frozen == true){
      players[i].display();
    } else {
      players[i].move();
  		players[i].display();
  		players[i].edgeDetection(S.loopMode); // loop,destroy,horizLoop,vertLoop
      if (players[i] == null) continue;
      players[i].getPoweredUp(); //pump some iron
  		players[i].collision();
    }

  }

  //render powerups to screen
    for (var i=0;i<powerups.length;i++){
      if (powerups[i] == null) continue;
      powerups[i].display();
    }

  //write powerups to array!
    if(frames % S.drawPowerup != 0) return;            
      var choosePU = floor(random(S.poweruplist.length));
      powerups.push(new powerUp(S.poweruplist[choosePU]));
      //console.log(powerups);
      //trim back to the total allowable amount of powerups
      if(powerups.length >= S.numPU+1){
        powerups.shift();
        //powerups.pop();
      }
};
