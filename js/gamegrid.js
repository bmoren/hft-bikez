
//
// Game.js
// useful description here
//

//Constants
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
};



// this is dead space, p5 eats a chilidog here. 
function draw(){}


//
// Draw
//
function hft_draw(init) {
  frames++;

  //render bikes to screen
  if (frames % S.drawFrame != 0) return;

  background(0);

	for (var i=0; i<players.length; i++) {
    if (players[i] == null) continue;
    if (players[i].frozen == true){
      players[i].display();
    } else {
      players[i].move();
  		players[i].display(frames);
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
