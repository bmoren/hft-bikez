var drawFrame = 5; //lower is faster frameRate
var frames = 0;
var playerColor;
var playerSize = 40;
var players = [];
function preload(){

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

//Generate players
  for (var i=0; i<5; i++) {
    playerColor = color(random(255),random(255),random(255));
    players.push(new bike(i,5,3,playerSize,playerColor, 20)); //playerID, spd, dir, bikeSz, color
     // players[i].setControls('w','s','a','d');
  }
  players[0].setControls('w','s','a','d');
  players[1].setControls('i','k','j','l');  
}

function draw() {
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
		players[i].collision();

  }

}

function bike(playerID, spd, dir, bikeSz, color, len){
 
 	this.color = color ;
	this.x = round(random(width));
	this.y = round(random(height)); //use whole numbers so getting values from the pixel array later is easier!
	this.bikeSize = bikeSz;
	this.speed = spd;
	this.direction = dir ;
  this.playerID = playerID;
  this.len = len ;


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

  this.setDirection = function(){
    if (keyIsPressed === true){ // determine direction //reimplement this using HFT for the controller
      if (key === this.control.up){
        this.direction = 1 ;
      }
      if (key === this.control.down){
        this.direction = 2 ;
      }
      if (key === this.control.left){
        this.direction = 3 ;
      }
      if (key === this.control.right){
        this.direction = 4 ;
      }
    } //close keyIsPressed
  }

  this.move = function() {

    if (this.direction === 1){ //up
  		this.y -= this.bikeSize ; 
  	}
  	if (this.direction === 2){ //down
  		this.y += this.bikeSize ; 
  	}
  	if (this.direction === 3){ //left
  		this.x -= this.bikeSize ; 
  	}
  	if (this.direction === 4){ //right
  		this.x += this.bikeSize ; 
  	}

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

  	if (this.x > width){ // off the right side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = 0; //loop to left side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			this.destroy();
  		}
  	} 

  	if (this.x < 0){//off the left side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = width; //loop to right side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			this.destroy();
  		}
	}

  	if (this.y > height){ // off the bottom
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = 0; //loop to top
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
        this.destroy();
  		}
  	}

  	if (this.y < 0){ // off the top
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = height; //loop to bottom
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
  			this.destroy();
  		}
  	}
  } //close edge detection 

  this.destroy = function(){

    var id = this.playerID;
    console.log('player', id);
    players[id] = null;

  }


} // close Bike






