var drawFrame = 2; //lower is faster frameRate
var frames = 0;
var playerColor;
var playerLength = 40;
var playerSize = 15;
var numPlayers = 20;
var players = [];

// constants
var _UP    = 1;
var _DOWN  = 2;
var _LEFT  = 3;
var _RIGHT = 4;

function preload(){
  destroySound = loadSound('boom.mp3');
  // @timgormly freesound.org
  music = loadSound('bkg.mp3');
  gameOverSound = loadSound('gameover.mp3');

}

function _collide(x, xW, y, yW,  sX, sXW, sY, sYW) {
  return sXW > x && sYW > y && xW > sX && yW > sY;
}

function hitTest(x,y,w, sX,sY,sW){
  return _collide(x, x+w, y, y+w,  sX, sX+sW, sY, sY+sW);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // frameRate(10);

  initGame();

}

function initGame(){

  players = []; // reset players array
  //Generate players
  for (var i=0; i<numPlayers; i++) {
    // playerSize = round(random(2,40));
    playerColor = color(random(255),random(255),random(255));
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
    loop();
    music.play();
    music.loop();
  }, 5000);

};

function gameOver(){
  var alive = [];
  for(var i=0; i<players.length; i++){
    if (players[i] != null) alive.push(players[i]);
  }
  return (alive.length > 1) ? false : true;
};

function draw() {

  if (gameOver()) initGame();

  frames++;

  for(var i=0; i<players.length; i++){
    if (players[i] == null) continue;
    players[i].setDirection();
    players[i].setDirection();
  }

  if (frames % drawFrame != 0) return;
  background(0);

	for (var i=0; i<players.length; i++) {
    if (players[i] == null) continue;
    players[i].move()
		players[i].display();
		players[i].edgeDetection('horizLoop'); // loop,destroy,horizLoop,vertLoop
    if (players[i] == null) continue;
		players[i].collision();

  }

  if (gameOver()) {
    noLoop();
    music.stop();
    gameOverSound.play();
    setTimeout(function(){
      loop();
    }, 3000);
  }

}

function bike(playerID, dir, bikeSz, color, len){
 
 	this.color = color ;
	
  var yOffset = (height / numPlayers) * 2;

  // set initial x/y coords of bike
  this.x = (width - (bikeSz*6)) - round(random(0, bikeSz*4));
  this.x = this.x - (playerID * bikeSz);
  this.y = (playerID * yOffset) + (height / numPlayers);

  if (playerID >= numPlayers/2){
    var nf = numPlayers/2;
    this.x = bikeSz*2 + round(random(0,bikeSz*5));
    this.x = this.x + ((playerID-nf) * bikeSz);
    this.y = (playerID-nf) * yOffset;
    this.y += bikeSz*2;
    this.direction = _RIGHT;
  }

  this.x = round(this.x);
  this.y = round(this.y);

  // - or, set random x/y coords
  // this.x = round(random(width));
  // this.y = round(random(height));

  this.bikeSize = bikeSz;
  this.direction = dir ;
  this.playerID = playerID;
  this.len = len ;
  this.ai = true;



  this.segment = [  ] ; //array of arrays!
  for(i=0; i < this.len; i++){
    this.segment[i] = [this.x+(i*this.bikeSize), this.y];
  }

  this.control = {};

  this.setControls = function(up, down, left, right){
    this.control.up = up;
    this.control.down = down;
    this.control.left = left;
    this.control.right = right;
  };

  this.moveAI = function(){
    if (!this.ai) return; // i'm human, i swear...
    var dir = this.direction;
    var next = round(random(1,4));

    // i'll move when I want to
    var entropy = round(random(0, 20));
    if (entropy == 5) this.direction = next;
    
    // try to avoid the top
    if (this.direction == _UP && (this.y-this.bikeSize) <= this.bikeSize*2){
      this.direction = round(random(3,4));
      return;
    }
    // try to avoid the bottom
    if (this.direction == _DOWN && (this.y+this.bikeSize) >= height-(this.bikeSize*2)){
      this.direction = round(random(3,4));
      return;
    }
    // try to avoid hitting myself and others?
    var attempt = 20;
    while( this.hitTestAI()){
      attempt--;
      if (attempt < 0) break;
      this.direction = round(random(1,4));
    }

  };

  this.hitTestAI = function(){
    var o = this.move(true);
    var hit = false;
    theLaw:
    for(var j=0; j<players.length; j++){
      var player = players[j];
      if (player == null) continue;
      var seg = player.segment;
      for(var i=1; i<seg.length; i++){
        var s = seg[i];
        if ( hitTest(o.x, o.y, this.bikeSize, s[0],s[1],this.bikeSize) ){
          hit = true;
          break theLaw;
        }
      }
    }
    return hit;
  };

  this.setDirection = function(){
    if (keyIsPressed === true || this.ai){ // determine direction //reimplement this using HFT for the controller

      // randomly choose direction, if we are an AI
      this.moveAI();

      if (key === this.control.up && this.direction != _DOWN){
        this.direction = _UP ;
      }
      if (key === this.control.down && this.direction != _UP){
        this.direction = _DOWN ;
      }
      if (key === this.control.left && this.direction != _RIGHT){
        this.direction = _LEFT ;
      }
      if (key === this.control.right && this.direction != _LEFT){
        this.direction = _RIGHT ;
      }
    } //close keyIsPressed
  }

  this.move = function(hTest) {
    var x = this.x;
    var y = this.y;

    if (this.direction === _UP){ //up
  		y -= this.bikeSize ; 
  	}
  	if (this.direction === _DOWN){ //down
  		y += this.bikeSize ; 
  	}
  	if (this.direction === _LEFT){ //left
  		x -= this.bikeSize ; 
  	}
  	if (this.direction === _RIGHT){ //right
  		x += this.bikeSize ; 
  	}
    // return results instead of setting them, for hit testing stuff
    if (hTest) return {x:x, y:y};

    this.x = x;
    this.y = y;

  };// close move class

  this.display = function() {
  	//rectMode(CENTER);
  	noStroke();
    // stroke(255);
  	fill(this.color);

    // draw segments (but not the head)
    for (var i = this.len-1; i > 0; i--) {

      this.segment[i][0] = Number(this.segment[i-1][0]);
      this.segment[i][1] = Number(this.segment[i-1][1]);

      rect(this.segment[i][0], this.segment[i][1], this.bikeSize, this.bikeSize);
     
    }

    fill(255,0,0);
    // draw the head
    this.segment[0][0] = this.x;
    this.segment[0][1] = this.y;
    rect(this.segment[0][0], this.segment[0][1], this.bikeSize, this.bikeSize);

  }; //close display

  this.collision = function(){
    var x = this.segment[0][0];
    var y = this.segment[0][1];
    var w = this.bikeSize;
    var id = this.playerID;

    // loop through all players
    dance:
    for(var i=0; i<players.length; i++){
      if (players[i] == null) continue;
      var player = players[i];
      // don't hit your own head
      for(var j=0; j < player.segment.length; j++){
      // loop through player segments
      if (player.playerID == id && j == 0) continue;
        var seg = player.segment[j];
        var sX = seg[0];
        var sY = seg[1];
        var sW = player.bikeSize;
        if ( hitTest(x,y,w, sX,sY,sW) ){
          this.destroy();
          break dance;
        }
        
      }
    }


  }; //close collision

  this.edgeDetection = function(mode){ // enable edge detection for top,right,bottom,left
  	//modes: loop, destroy, horizLoop, vertLoop

    //if( this == null) return;

  	if (this.x > width){ // off the right side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = 0; //loop to left side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			return this.destroy();
  		}
  	} 

  	if (this.x < 0){//off the left side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = width; //loop to right side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			return this.destroy();
  		}
	}

  	if (this.y > height){ // off the bottom
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = 0; //loop to top
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
        return this.destroy();
  		}
  	}

  	if (this.y < 0){ // off the top
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = height; //loop to bottom
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
  			return this.destroy();
  		}
  	}
  }; //close edgeDetection


  this.destroy = function(){

    var id = this.playerID;
    players[id] = null;
    destroySound.play();

  };


} // close Bike class/object






