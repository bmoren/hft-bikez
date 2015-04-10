/////////////////////
/////GAME OPTIONS////
/////////////////////
//PLAYERS
var numPlayers = 2;    //how many players
var playerLength = 30;  //length of the players, length also effects speed (length greatly affects framerate capability)
var playerSize = 15;     //how big are the players
var drawFrame = 3;      //speed to render the players, lower is faster 
//POWERUPS              //size,ghost,freeze,psyMode
var poweruplist = ['size']//[ 'size','ghost','freeze', 'psyMode']; 
var drawPowerup = 60;   //how often to refresh the powerups, lower is faster
var numPU = 4;          //how many powerups to display at any one time?
//BRICKS
var brickMode = true;   //turn bricks on/off completely
var numBricks = 20      //how many bricks for players to hit/avoid?
//WORLD PARAMS
var sound_on = false;   // true: play sounds. false: no sounds
var clearBG = true;     //clear the background? leave trails? (does not change hit detection)
var loopMode = 'horizLoop';  //loop, destroy, horizLoop, vertLoop

//storage
var bgColor = 0;        //bgColor gets set in the setup() for access to p5 color() method.
var tempBGColor;
var winMessage; 
var gameOverMessage = false;

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
  bgColor = color(0,0,0); // set bg color, has to happen here so we have access to p5.js methods
  tempBGColor = bgColor; //setup the storage fo the background color
  background(bgColor); //incase the bg refresh is turned off

  initGame(); //lets get going!

} //close setup

function initGame(){

  players = []; // reset players array
  powerups = [];

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


  console.log('Game starts in 5 seconds...');
  loop();
  noLoop();
  setTimeout(function(){
    gameOverMessage = false; 
    loop();
    music.play();
    music.loop();
    bgColor = tempBGColor; //reset the bgColor after a player has won and shifted the bgColor to thiers
    background(bgColor); //reset the background color back to the original
  }, 5000);

}; // close initGame

function gameOver(){
  var alive = [];
  for(var i=0; i<players.length; i++){
    if (players[i] != null) alive.push(players[i]);
  }
  //console.log(alive);

  //look at the last player standing and get player ID for a winner popup and set background color to thier color.
  if(alive.length == 1){
    music.stop(); //stop the music when everyone dies.
    bgColor = alive[0].color //grab the winning players color to reset the background
    winMessage = "Player " + alive[0].playerID + " Wins!"
    gameOverMessage = true;
   }

  return (alive.length > 1) ? false : true;


}; //close gameOver

function draw() {

  if (gameOver()) initGame();

  frames++;

  //handle game over
  if (gameOver()) {
    noLoop();
    music.stop();
    gameOverSound.play();

    setTimeout(function(){
      loop();
    }, 3000);
  }


  //handle movement at the normal framerate
  for(var i=0; i<players.length; i++){
    if (players[i] == null) continue;
    players[i].setDirection();
    players[i].setDirection();
  }

  //render bikes to screen
  if (frames % drawFrame != 0) return;

  //refresh bkg at same rate as bikes
  if (clearBG == true){
    background(bgColor);
  }

  if(gameOverMessage){
    //invert the color of the winner
    var messageColor = color(255-red(bgColor), 255-green(bgColor), 255-blue(bgColor)); 
    textPopUp(winMessage,messageColor);
  }

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




