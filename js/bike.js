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
  this.segment = [  ] ; //keep track of each segment, how long is the bike?
  this.frozen = false;  //is there a frozen powerup?
  this.ghost = false;

  //for testing score before adding the scorekeeping functionality.
  this.score = round(random(1,100));
  //this.score = 0; // how many people you've killed
  this.time = Date.now();  // how long you've survived

  this.control = {}; //a thing
  this.started = false;

  //
  // removes frozen and ghost and starts the player moving
  //
  this.go = function(){
    this.started = true;
    this.frozen = false;
    this.ghost = false;
  }

  //
  // adds frozen and ghost and sets player x/y position and builds segments
  //
  this.ready = function(){
    //keep it on the whole number grid
    this.x = floor(random(0, width-(this.bikeSize*2)));
    this.y = floor(random(0, height-(this.bikeSize*2)));

    for(i=0; i < this.len; i++){
      this.segment[i] = [this.x+(i*this.bikeSize), this.y];
    }

    this.frozen = true;
    this.ghost = true;

  };

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


  this.relength = function(length){

    var origlen = this.len;
    var newlen = this.len + length;
  
  // randomly add or subtract length
    if (random()>.5) {

      // don't get longer than the screen width
      if (newlen > (width/this.bikeSize - 1)) {
        this.len = round(width/this.bikeSize - 1);
      } else {
      this.len = this.len + length;
      }
    } else {

      // don't get shorter than 0
        if ((this.len - length) < 1) {
          this.len = 0;
           } else {
            this.len = this.len - length;
            }
    }

    //need to rebuild the segment array after length change, because length is only set once
    //keep it on the whole number grid

    for(i=0; i < this.len; i++){
      this.segment[i] = this.segment[i]//[this.x+(i*this.bikeSize), this.y];
    }

    // if length grows then needs to add new segments to the end.
    if (this.len > origlen) {

      for(i=origlen; i < this.len; i++){

        // use last segment as the starting point to grow extra length
        var lastposx = this.segment[origlen-1][0]
        var lastposy = this.segment[origlen-1][1]
        
        this.segment[i] = [lastposx+(i*this.bikeSize), lastposy];
      }
    }

    this.display();

  };


  this.display = function(frames) {

    noStroke();
    // draw segments (but not the head)
    fill(this.color);

    //if your not started then blink!
    if( frames % 5 == 0 && this.started == false){
      fill(inverseColor(this.color));
    }

    for (var i = this.len-1; i > 0; i--) {
      if (this.frozen == false){
        this.segment[i][0] = Number(this.segment[i-1][0]);
        this.segment[i][1] = Number(this.segment[i-1][1]);
      }
      rect(this.segment[i][0], this.segment[i][1], this.bikeSize, this.bikeSize);
    }

    // draw the head
    fill(inverseColor(this.color));
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
    }else 
    if(type == "length"){
      var length = round(this.len/4);
      this.relength(length);
    }
  };

  // this needs to be changes so it not chekcing if we his someone else, the desroy oursleves, it should be if someone else hit us destroy them and add a point.
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

    // 1. find the player in players array with this.playerID
    // 2. remove that player from the players array
    // 3. add next player from the queue to the same index in the players array
    var id = this.playerID;
    var index = null;

    for (var i=0; i<players.length; i++){
      var p = players[i];
      if(p && p.playerID == id) index = i;
    }

    players[id] = null;
    queue.addToGame(index);

    destroySound.play();

  };


} // close Bike class