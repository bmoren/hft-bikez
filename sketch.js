/////////////////////
/////GAME OPTIONS////
/////////////////////
//PLAYERS
var numPlayers = 2;    //how many players
var playerLength = 25;  //length of the players, length also effects speed (length greatly affects framerate capability)
var playerSize =15;     //how big are the players
var drawFrame = 2;      //speed to render the players, lower is faster 
//POWERUPS              //size,invincible,freeze,psyMode
var poweruplist = [ 'size','invincible','freeze','psyMode' ]; //powerup types defined in the powerUp function below
var drawPowerup = 60;   //how often to refresh the powerups, lower is faster
var numPU = 4;          //how many powerups to display at any one time?
//BRICKS
var brickMode = true;   //turn bricks on/off completely
var numBricks = 20      //how many bricks for players to hit/avoid?

var sound_on = false;   // true: play sounds. false: no sounds
var clearBG = true;     //clear the background? leave trails?

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

function _collide(x, xW, y, yW,  sX, sXW, sY, sYW) {
  return sXW > x && sYW > y && xW > sX && yW > sY;
}

function hitTest(x,y,w, sX,sY,sW){
  return _collide(x, x+w, y, y+w,  sX, sX+sW, sY, sY+sW);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  initGame();

} //close setup

function initGame(){

  players = []; // reset players array
  powerups = [];
  background(0);
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
    loop();
    music.play();
    music.loop();
  }, 5000);

}; // close initGame

function gameOver(){
  var alive = [];
  for(var i=0; i<players.length; i++){
    if (players[i] != null) alive.push(players[i]);
  }
  //console.log(alive);

  //look at the last player standing and get player ID for a winner popup and set background color to thier color.
  // if(alive.length < 1){
  //   console.log(alive[0].color);
  // }

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

  if (clearBG == true){
    background(0);
  }

	for (var i=0; i<players.length; i++) {
    if (players[i] == null) continue;
    if (players[i].frozen == true){
      players[i].display();
    } else {
      players[i].move();
  		players[i].display();
  		players[i].edgeDetection('horizLoop'); // loop,destroy,horizLoop,vertLoop
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


function bike(playerID, dir, bikeSz, color, len){
 
 	this.color = color ;
  this.bikeSize = bikeSz;
  this.direction = dir ;
  this.playerID = playerID;
  this.len = len ;
  this.ai = true;
  this.segment = [  ] ; //keep track of each segment, how long is the bike?
  this.frozen = false;  //is there a frozen powerup?
  this.invincible = false;


  //starting positions
  var panelWidth = width/3;
  var groupOffset = ceil(numPlayers/3);
  var yOffset = (height / groupOffset);


  if(playerID < groupOffset){
    console.log('group1:', playerID);
    //group1
    this.x = panelWidth/2;
    this.y = playerID * yOffset // disperse players horizontally 
    this.y += yOffset / 2 //offset so there is no one huggin the top.
  }

  if(playerID >= groupOffset && playerID < (groupOffset*2)){
    console.log('group2:', playerID);
    // group2
    this.x = panelWidth+(panelWidth/2);
    this.y = (playerID - groupOffset) * yOffset // disperse players horizontally, - group offset so it resets to 0
    this.y += yOffset / 2 //offset so there is no one huggin the top.
    this.y += bikeSz*2;
  }

  if(playerID >= (groupOffset*2)){
    console.log('group3:', playerID);
    //group 3
    this.x = width-(panelWidth/2);
    this.y = (playerID - (groupOffset*2)) * yOffset // disperse players horizontally -groupoffset*2 to reset to 0
    this.y += yOffset / 2 //offset so there is no one huggin the top.
  }

  //keep it on the whole number grid
  this.x = round(this.x);
  this.y = round(this.y);

  // - or, set random x/y coords
  // this.x = round(random(width));
  // this.y = round(random(height));
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

    // i'll move when I want to
    var entropy = round(random(0, 75));
    if (entropy == 5) this.direction = next;

    // try to avoid hitting myself and others?
    var attempt = 30;
    while( this.hitTestAI()){
      attempt--;
      if (attempt < 0) break;
      this.direction = round(random(1,4));
    }

  };

  this.hitTestAI = function(){
    var o = this.move(true);
    var hit = false;
    var id = this.playerID;
    theLaw:
    for(var j=0; j<players.length; j++){
      var player = players[j];
      if (player == null) continue;
      var seg = player.segment;
      // loop through player segments
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
    // stroke(this.color);
    //noFill();
  	 fill(this.color);

    // draw segments (but not the head)
    for (var i = this.len-1; i > 0; i--) {

      if (this.frozen == false){
        this.segment[i][0] = Number(this.segment[i-1][0]);
        this.segment[i][1] = Number(this.segment[i-1][1]);
      }

      rect(this.segment[i][0], this.segment[i][1], this.bikeSize, this.bikeSize);
     
    }

     fill(255,0,0);
    // draw the head
    this.segment[0][0] = this.x;
    this.segment[0][1] = this.y;
    rect(this.segment[0][0], this.segment[0][1], this.bikeSize, this.bikeSize);

  }; //close display

  this.getPoweredUp = function(){
    var x = this.segment[0][0];
    var y = this.segment[0][1];
    var w = this.bikeSize;
    for(var i=0; i<powerups.length; i++){
      var p = powerups[i];
      if (p == null) continue;
      if( hitTest(x,y,w,  p.x, p.y, p.size)){
        // we are eating something powerful
        this.usePowerup( p.type );
        // remove the powerup (if not already removed)
        if (powerups[i]) p.remove();
      }
    }
  };

  this.usePowerup = function(type){
    if(type == "size"){
      //when getting smaller square seperation is a bit awkward....maybe fix it?
      this.bikeSize = round(random(this.bikeSize/2,this.bikeSize*2));
    }else 
    if(type == "invincible"){ 
      //right now this is ghost mode, you cant kill or be killed.... maybe you should be able to kill...
      this.invincible = true;
      var that = this; // store the this so that we can see it in the anon function in the timeout
      setTimeout(function(){
        that.invincible = false ;
      }, 20000); // should this be a rand value set by the poweUp object?
    }else 
    if(type == "freeze"){
      this.frozen = true;
      var that = this; // store the this so that we can see it in the anon function in the timeout
      setTimeout(function(){
        that.frozen = false ;
      }, 2000); // should this be a rand value set by the poweUp object?
    }else 
    if(type == "psyMode"){
      clearBG = false; 
      setTimeout(function(){
        clearBG = true ;
      }, 5000); 


    }
  };

  this.collision = function(){
    var x = this.segment[0][0];
    var y = this.segment[0][1];
    var w = this.bikeSize;
    var id = this.playerID;

    if(this.invincible == true) return;

    // loop through all players
    dance:
    for(var i=0; i<players.length; i++){
      if (players[i] == null) continue;
      var player = players[i];
      if(player.invincible == true) continue;
      // don't hit your own head
      for(var j=0; j < player.segment.length; j++){
        // loop through player segments
        if (player.playerID == id && j < 2) continue;
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
        //If i do this.x = 0-this.bikeSize, it results in a crash, how to eliminate the gap in the loop from right to left?
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


} // close Bike class



//Should each PU be its own class or should we make one class called powerup and have the varability contained within that? Im leaning towards that since we would only need to have one hit detection its less replecation of code/more efficent on the page so to speak.

function powerUp(type){
  this.id = Date.now();
  this.x = random(width);
  this.y = random(height);
  // square power UPS, fool
  this.size = playerSize*3;

  //types: size, invincible, freeze
  this.type = type;

  this.display = function(){
    if(this.type == 'size'){
      fill(255,255,255); // replace with flickering powerup icons!
    }else if(this.type == 'invincible'){
      fill(255,0,255);
    }else if(this.type == 'freeze'){
      fill(0,0,255);
    }else if( this.type == 'psyMode'){
      fill(random(255),random(255),random(255));
    }
    rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
  }

  this.remove = function(){
    //powerup gets hit, animation?
    for(var i=0; i<powerups.length; i++){
      if (powerups[i] == null) continue;
      if (powerups[i].id == this.id){
        powerups[i] = null;
      }
    }
  }

  // this.collision = function(){

    //Im shaky on this, but generally we need to identify which player hit the PU, track the hit, remove the PU and then apply the proper effect to the player. 
    //another question, How do we/should we deal with the 'decay' of the effect, meaning...how do we turn it off after a little bit?
    //are there some powerups that last forever?
  // }
 
}





