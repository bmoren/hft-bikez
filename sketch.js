var playerColor;
var players = [];
function preload(){

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  for (var i=0; i<1; i++) {
	  playerColor = color(random(255),random(255),random(255));
	  players.push(new bike(1,3,5,playerColor));
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

function bike(spd, dir, bikeSz, color){
 
 	this.color = color ;
	this.x = round(random(width));
  	this.y = round(random(height)); //use whole numbers so getting values from the pixel array later is easier!
  	this.bikeSize = bikeSz;
  	this.speed = spd;
  	this.direction = dir ;
  	//console.log("this.x: "+this.x+ " && this.y: "+this.y)

  this.move = function(up, down, left, right) {

	if (keyIsPressed === true){ // determine direction //reset this using HFT when implemented
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
      this.dirDetectY = -1;
  	}
  	if (this.direction === 2){ //down
  		this.y += this.speed ; 
      this.dirDetectY = 1;
  	}
  	if (this.direction === 3){ //left
  		this.x -= this.speed ; 
      this.dirDetectX = -1;
  	}
  	if (this.direction === 4){ //right
  		this.x += this.speed ; 
      this.dirDetectX = 1;
  	}

  };// close move class

  this.display = function() {
  	rectMode(CENTER);
  	noStroke();
  	fill(this.color);
    rect(this.x, this.y, this.bikeSize, this.bikeSize);
    fill(255,255,255);
  }; //close display

  this.collision = function(){
    // if(get(x,y) != color(0)){
    //   console.log("dead")
    // }

 fill(255,255,255);
   //X
  if(this.direction == 3 || this.direction == 4){
   if(this.dirDetectX == 1){
    rect(this.x+this.dirDetectX+10,this.y,1,1);
   } else if(this.dirDetectX == -1) {
    rect(this.x+this.dirDetectX-10,this.y,1,1);
   }
 }

   if(this.direction == 1 || this.direction == 2){
     if(this.dirDetectY == 1){
      console.log("foo")
      rect(this.x,this.y+this.dirDetectY+10,1,1);
     } else if(this.dirDetectY == -1){
      rect(this.x,this.y+this.dirDetectY-10,1,1);

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
  			//destroy code here
  			console.log('destroyd, right');
  		}
  	} 

  	if (this.x < 0){//off the left side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = width; //loop to right side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			//destroy code here
  			console.log('destroyd, left');
  		}
	}

  	if (this.y > height){ // off the bottom
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = 0; //loop to top
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
  			//destroy code here
  			console.log('destroyd, bottom');
  		}
  	}

  	if (this.y < 0){ // off the top
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = height; //loop to bottom
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
  			//destroy code here
  			console.log('destroyd, top');
  		}
  	}


  } //close edge detection 

} // close Bike


