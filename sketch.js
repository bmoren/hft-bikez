/////////////////////
/////GAME OPTIONS////
/////////////////////
//PLAYERS
var numPlayers = 2;    //how many players
var playerLength = 30;  //length of the players, length also effects speed (length greatly affects framerate capability)
var playerSize = 15;     //how big are the players
var drawFrame = 2;      //speed to render the players, lower is faster 
//POWERUPS              //size,ghost,freeze,psyMode
var poweruplist = ['freeze']//[ 'size','ghost','freeze', 'psyMode']; 
var drawPowerup = 60;   //how often to refresh the powerups, lower is faster
var numPU = 4;          //how many powerups to display at any one time?
//BRICKS
var brickMode = true;   //turn bricks on/off completely
var numBricks = 20      //how many bricks for players to hit/avoid?
//WORLD PARAMS
var sound_on = true;   // true: play sounds. false: no sounds
var clearBG = true;     //clear the background? leave trails? (does not change hit detection)
var loopMode = 'horizLoop';  //loop, destroy, horizLoop, vertLoop
var gameStarted = false; // true: the game is being played. false: not playing
var bgColor = 0;

//Constants
var _UP    = 1;
var _DOWN  = 2;
var _LEFT  = 3;
var _RIGHT = 4;
var frames = 0;
var playerColor;
var players = [];
var powerups = [];


function preload(){
  destroySound = loadSound('boom.mp3');  // @timgormly freesound.org
  music = loadSound('bkg.mp3');
  gameOverSound = loadSound('gameover.mp3');

  if (sound_on == false){
    masterVolume(0);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(0,0,0);
  background(bgColor);
  initGame(); //lets get going!

} //close setup

function initGame(){

  players = []; // reset players array
  powerups = [];
  drawBackground();
  music.loop();

  //Generate players
  for (var i=0; i<numPlayers; i++) {
    // playerSize = round(random(2,40));
    playerColor = color(random(255),random(255),random(255));
    //playerSize = random(5,30);
    players.push(new bike(i, _LEFT, playerSize, playerColor, playerLength)); //playerID, dir, bikeSz, color, num segments
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
    gameStarted = true;
  }, 5000);

}; // close initGame

function drawBackground(c, message){
  c = c || bgColor;
  if (clearBG == true){
    background(c);
  }
  if (message){
    console.log('message:', message );
    background(c);
    //invert the color of the winner
    var messageColor = color(255-red(c), 255-green(c), 255-blue(c)); 
    textPopUp(message, messageColor);
  }

}; //close drawBackground


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
      drawBackground(bgColor, "Draw!");
    }
  }

  return isGameOver;


}; //close gameOver

function draw(init) {

  if (gameStarted == false && !init) return;

  //handle game over
  if (gameOver()) {
    gameStarted = false;
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
  if (frames % drawFrame != 0) return;

  drawBackground();

	for (var i=0; i<players.length; i++) {
    if (players[i] == null) continue;
    if (players[i].frozen == true){
      players[i].display();
    } else {
      players[i].move();
  		players[i].display();
  		players[i].edgeDetection(loopMode); // loop,destroy,horizLoop,vertLoop
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
    if(frames % drawPowerup != 0) return;            
      var choosePU = floor(random(poweruplist.length));
      powerups.push(new powerUp(poweruplist[choosePU]));
      //console.log(powerups);
      //trim back to the total allowable amount of powerups
      if(powerups.length >= numPU+1){
        powerups.shift();
        //powerups.pop();
      }
} // close Draw




