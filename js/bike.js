//
// Bike
//

function bike(netPlayer, name, playerID, bikeSz, len){
 
  this.netPlayer = netPlayer;
  this.color = color(random(255),random(255),random(255));
  this.bikeSize = bikeSz;
  this.origBikeSize = bikeSz;
  this.direction =  _LEFT;
  this.playerID = playerID;
  this.name = name;
  this.len = len ;
  this.ai = false;
  this.segment = [  ] ; //keep track of each segment, how long is the bike?
  this.frozen = false;  //is there a frozen powerup?
  this.ghost = false;

  console.log('creating player', this.playerID);
  console.log( this );

  //starting positions
  var panelWidth = width/3;
  var groupOffset = ceil(S.numPlayers/3);
  var yOffset = (height / groupOffset);


  if(playerID < groupOffset){
    //group1
    this.x = panelWidth/2;
    this.y = playerID * yOffset // disperse players horizontally 
    this.y += yOffset / 2 //offset so there is no one huggin the top.
  }

  if(playerID >= groupOffset && playerID < (groupOffset*2)){
    // group2
    this.x = panelWidth+(panelWidth/2);
    this.y = (playerID - groupOffset) * yOffset // disperse players horizontally, - group offset so it resets to 0
    this.y += yOffset / 2 //offset so there is no one huggin the top.
    this.y += bikeSz*2;
  }

  if(playerID >= (groupOffset*2)){
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

      //console.log("key: ", key)

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


  this.resize = function(size){
  	var oldSize = this.bikeSize;
  	this.bikeSize = size;
  	// are we going to become smaller or bigger?
  	var smaller = (oldSize > size) ? true : false;
    var diff = (size-oldSize);
    // maybe help to prevent killing self when 'growing' ??
    if (!smaller && diff > size) this.bikeSize = (oldSize*2)-3;
  };

  this.display = function() {
    noStroke();
    // draw segments (but not the head)
    fill(this.color);
    for (var i = this.len-1; i > 0; i--) {
      if (this.frozen == false){
        this.segment[i][0] = Number(this.segment[i-1][0]);
        this.segment[i][1] = Number(this.segment[i-1][1]);
      }
      rect(this.segment[i][0], this.segment[i][1], this.bikeSize, this.bikeSize);
    }

    // draw the head
    fill(255,0,0);
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
      var size = round(random(S.playerSize/2, S.playerSize*2));
      this.resize(size);
    } else 
    if(type == "ghost"){ 
      //right now this is ghost mode, you cant kill or be killed.... maybe you should be able to kill...
      this.ghost = true;
      var that = this; // store the this so that we can see it in the anon function in the timeout
      setTimeout(function(){
        that.ghost = false ;
      }, 2000); // should this be a rand value set by the poweUp object?
    }else 
    if(type == "freeze"){
      this.frozen = true;
      var that = this; // store the this so that we can see it in the anon function in the timeout
      setTimeout(function(){
        that.frozen = false ;
      }, 2000); // should this be a rand value set by the poweUp object?
    }else 
    if(type == "psyMode"){
      S.clearBG = false; 
      setTimeout(function(){
        S.clearBG = true ;
      }, 5000); 


    }
  };

  this.collision = function(){
    var x = this.segment[0][0];
    var y = this.segment[0][1];
    var w = this.bikeSize;
    var id = this.playerID;

    if(this.ghost == true) return;

    // loop through all players
    dance:
    for(var i=0; i<players.length; i++){
      if (players[i] == null) continue;
      var player = players[i];
      if(player.ghost == true) continue;
      // don't hit your own head
      for(var j=0; j < player.segment.length; j++){
        // loop through player segments
        if (player.playerID == id && j < 4) continue;
        var seg = player.segment[j];
        var sX = seg[0];
        var sY = seg[1];
        var sW = player.bikeSize;
        if ( hitTest(x,y,w, sX,sY,sW) ){
          // we hit a head of another bike!
          if (j == 0){
            // destroy the other player
            player.destroy();
          }
          // destroy yourself
          this.destroy();
          break dance;
        }
      }
    }
  }; //close collision

  this.edgeDetection = function(mode){ // enable edge detection for top,right,bottom,left
  	//modes: loop, destroy, horizLoop, vertLoop

  	if (this.x > width && this.direction === _RIGHT){ // off the right side
  		if (mode === 'loop' || mode === 'horizLoop'){
        this.x = 0-this.bikeSize // loop to the left side
        //If i do this.x = 0-this.bikeSize, it results in a crash, how to eliminate the gap in the loop from right to left?
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			return this.destroy();
  		}
  	} 

  	if (this.x < 0 && this.direction === _LEFT){//off the left side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = width; //loop to right side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			return this.destroy();
  		}
	}

  	if (this.y > height && this.direction === _DOWN){ // off the bottom
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = 0 -this.bikeSize; //loop to top
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
        return this.destroy();
  		}
  	}

  	if (this.y < 0 && this.direction === _UP){ // off the top
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