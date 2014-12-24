var playerColor;
var players = [];
function preload(){

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  for (var i=0; i<3; i++) {
	  playerColor = color(random(255),random(255),random(255));
	  players.push(new bike(i,5,3,6,playerColor));
  }
}

function draw() {

  loadPixels();

	for (var i=0; i<players.length; i++) {
		players[i].move('w','s','a','d');
		players[i].display(playerColor);
		players[i].edgeDetection('horizLoop');
		players[i].collision();
	}

}

function bike(playerID, spd, dir, bikeSz, color){
 
 	this.color = color ;
	this.x = round(random(width));
	this.y = round(random(height)); //use whole numbers so getting values from the pixel array later is easier!
	this.bikeSize = bikeSz;
	this.speed = spd;
	this.direction = dir ;
  this.playerID = playerID;
  

  this.move = function(up, down, left, right) {

	if (keyIsPressed === true){ // determine direction //reimplement this using HFT for the controller
    if (key === up){
      this.direction = 1 ;
    }
    if (key === down){
      this.direction = 2 ;
    }
    if (key === left){
      this.direction = 3 ;
    }
    if (key ===right){
      this.direction = 4 ;
    }
  } //close keyIsPressed

    if (this.direction === 1){ //up
  		this.y -= this.speed ; 
      this.dirDetectY = -1; // -1Y = up
  	}
  	if (this.direction === 2){ //down
  		this.y += this.speed ; 
      this.dirDetectY = 1; // +1Y = down
  	}
  	if (this.direction === 3){ //left
  		this.x -= this.speed ; 
      this.dirDetectX = -1; //-1X = left
  	}
  	if (this.direction === 4){ //right
  		this.x += this.speed ; 
      this.dirDetectX = 1; //+1X = right
  	}

  };// close move class

  this.display = function() {
  	rectMode(CENTER);
  	noStroke();
  	fill(this.color);
    rect(this.x, this.y, this.bikeSize, this.bikeSize);
  }; //close display

  this.collision = function(){
    fill(255,255,255);

    // if(get(x,y) != color(0)){
    //   console.log("dead")
    // }

    //****** Need to figure out scalable offset
    var szOffset = 2; //2 is about good for a bikesize of 6
    //X
    if(this.direction == 3 || this.direction == 4){
      if(this.dirDetectX == 1){
        rect(this.x+this.dirDetectX+szOffset,this.y,1,1);
      } else if(this.dirDetectX == -1) {
        rect(this.x+this.dirDetectX-szOffset,this.y,1,1);
      }
    }// close X

    //Y
    if(this.direction == 1 || this.direction == 2){
      if(this.dirDetectY == 1){
        rect(this.x,this.y+this.dirDetectY+szOffset,1,1);
      } else if(this.dirDetectY == -1){
        rect(this.x,this.y+this.dirDetectY-szOffset,1,1);
      }
    } //close Y

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
    
    console.log("destroy fired" + this.playerID);

  }


} // close Bike


