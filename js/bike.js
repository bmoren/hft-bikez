//
// Bike
//
// for team play
var team1count = 0;         // number of active players in each team
var team2count = 0;
var team3count = 0;

function bike(netPlayer, name, playerID, bikeSz, len, score, ctime){
  var _self = this;
  this.netPlayer = netPlayer;
  this.color = color(random(255),random(255),random(255));
  this.bikeSize = bikeSz;
  this.origBikeSize = bikeSz;
  this.direction =  _LEFT;
  this.playerID = playerID;
  this.name = (name) ? name.toUpperCase() : name;
  this.len = len ;
  this.segment = [  ] ; //keep track of each segment, how long is the bike?
  this.frozen = false;  //is there a frozen powerup?
  this.frozenID = 0; // needed for setTimer on duration of powerup to work properly
  this.ghost = false;
  this.ghostID = 0; // needed for setTimer on duration of powerup to work properly
  this.star = false;
  this.starID = 0; // needed for setTimer on duration of powerup to work properly
  this.team = 0; // team number for team play
  this.createdTime = Date.now();

  this.__cheat_mode = false;

  //for testing score before adding the scorekeeping functionality.
  //this.score = round(random(1,100));
  
  this.score = score; // how many people you've killed
  this.time = null; // how long you've survived, set this to Date.now() when the player presses "GO"

  this.control = {}; //a thing
  this.started = false;


  // update the player UI
  this.updateUI = function(){
    var rank = playerManager.getRank(_self.playerID);
    this.netPlayer.sendCmd('updateUI', {
      playerID: _self.playerID,
      name: _self.name,
      score: _self.score,
      time: _self.createdTime,
      rank: rank
    })
    playerManager.updatePlayer(this);

    this.rank = rank;

  };
  // do this right away!
  this.updateUI();


  this.init = function(){
    this.started = false;
    this.color = color(random(255),random(255),random(255));
    this.direction = _LEFT;
    this.bikeSize = this.origBikeSize;
    this.frozen = false;
    this.ghost = false;
    this.star = false;
  }


  //
  // removes frozen and ghost and starts the player moving
  //
  this.go = function(){
    this.started = true;
    this.frozen = false;
    var kungfoomaster = this;
    setTimeout(function(){kungfoomaster.ghost = false}, 1000);
    this.time = Date.now();
  }

  //
  // adds frozen and ghost and sets player x/y position and builds segments
  //
  this.joinGame = function(){
    this.frozen = true;
    this.ghost = true;

    // set team for team play.
    if (S.teamPlay){
      if ((team1count <= team2count) && (team1count <= team3count)) {
        this.team = 1;
        team1count++;
        this.color = color(S.team1color[0],S.team1color[1],S.team1color[2]);
      } else if ((team2count <= team1count) && (team2count <= team3count)){
        this.team = 2;
        team2count++;
        this.color = color(S.team2color[0],S.team2color[1],S.team2color[2]);
      } else if ((team3count <= team1count) && (team3count <= team2count)) {
        this.team = 3;
        team3count++;
        this.color = color(S.team3color[0],S.team3color[1],S.team3color[2]);
      } else{
        this.team = 1;
        team1count++;
        this.color = color(S.team1color[0],S.team1color[1],S.team1color[2]);
      }
    }
    
    //keep it on the whole number grid
    this.x = floor(random(0, width-(this.bikeSize*2)));
    this.y = floor(random(0, height-(this.bikeSize*2)));

    for(i=0; i < this.len; i++){
      this.segment[i] = [this.x+(i*this.bikeSize), this.y];
    }
    var gadget = this;
    setTimeout(function(){gadget.go()}, S.releaseTime );
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
    //if (!smaller && diff > size) this.bikeSize = (oldSize*2)-3;
    if ((this.bikeSize*this.len) > width) {
      this.bikeSize = oldSize;
    }

  };


  // this.relength = function(length){

  //   var origlen = this.len;
  //   var newlen = this.len + length;
  
  // // randomly add or subtract length
  //   if (random()> .5) {

  //     // don't get longer than the screen width.
  //     if ((this.len + length) > (width/this.bikeSize - 1)) {
  //       this.len = round(width/this.bikeSize - 1);
  //     } else {
  //     this.len = this.len + length;
  //     }
  //   } else {

  //     // don't get shorter than 0
  //       if ((this.len - length) < 1) {
  //         this.len = 0;
  //          } else {
  //           this.len = this.len - length;
  //           }
  //   }

  //   // if length grows then needs to add new segments to the end.
  //   if (this.len > origlen) {
  //     for(i=origlen; i < this.len; i++){
  //       // use last segment as the starting point to grow extra length
  //       var lastposx = this.segment[origlen-1][0];
  //       var lastposy = this.segment[origlen-1][1];
  //       this.segment[i] = [lastposx+(i*this.bikeSize), lastposy];
  //       }
  //     } else {
  //       //need to rebuild the segment array after length shortens
  //       this.segment = subset(this.segment,0,this.len);
  //     }

  //   // need to call display or crashes... unsure why right now.
  //   this.display();

  // };
  // 



  this.display = function(frames) {

    noStroke();
    // draw segments (but not the head)
    // if mario stared make look blinky. like the star you are!
    // 

    if (this.star == true){
      fill(random(255),random(255),random(255));
    } else {
      fill(this.color);
    }

    //if your not started then blink!
    // if( frames % 5 == 0 && this.started == false){
    //   fill(inverseColor(this.color));
    // }

    for (var i = this.len-1; i > 0; i--) {
      if (this.frozen == false){
        this.segment[i][0] = Number(this.segment[i-1][0]);
        this.segment[i][1] = Number(this.segment[i-1][1]);
      }

      if (i % 2 == 0 && this.__cheat_mode) {
        fill(inverseColor(this.color));
      } else {
        fill(this.color);
      }
      rect(this.segment[i][0], this.segment[i][1], this.bikeSize, this.bikeSize);
    }

    // draw the head
    if (this.star == true){
      fill(random(256),random(256),random(256));
    }else{
      fill(inverseColor(this.color));
    }
    this.segment[0][0] = this.x;
    this.segment[0][1] = this.y;
    rect(this.segment[0][0], this.segment[0][1], this.bikeSize, this.bikeSize);

    //do this here so the name stays on top!
    if(S.displayNames){
      textSize(S.playerNameSize || 24);
      // textStyle(BOLD);
      // fill(inverseColor(this.color));
      fill(color(255,255,255));
      textFont("Helvetica");
      var n = this.name;

      if (this.__cheat_mode){
        n = '✨👾'
      }

      if (this.rank == 1){
        n = "👑 "+ this.name;
      }

      text(n, this.x+this.bikeSize,this.y - this.bikeSize/2);
    }

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

    netPlayers[this.playerID].sendCmd('powerupSound', 'gettingPoweredUpBRO'); // send the powerup sound message to the controller.

    if(type == "size"){
      var size = ceil(random((S.playerSize/S.poweruplist[1].scale), (S.playerSize*S.poweruplist[1].scale)));
      this.resize(size);
    } else 
    if(type == "ghost"){ 
      //right now this is ghost mode, you cant kill or be killed.... maybe you should be able to kill...
      
      // setTimeout does not like to be called twice; clear existing setTimeout if one is running.
      if (this.ghost == true){
        clearTimeout(this.ghostID);
        var that = this; // store the this so that we can see it in the anon function in the timeout
        this.ghostID = setTimeout(function(){
          that.ghost = false ;
        }, S.poweruplist[2].duration); // settings.js
      } else {
      var that = this; // store the this so that we can see it in the anon function in the timeout
      this.ghost = true;
      this.ghostID = setTimeout(function(){
        that.ghost = false ;
      }, S.poweruplist[2].duration); // settings.js
      }
    }else 
    if(type == "freeze"){

      // setTimeout does not like to be called twice; clear existing setTimeout if one is running.
      if (this.frozen == true){
        clearTimeout(this.frozenID);
        var that = this; // store the this so that we can see it in the anon function in the timeout
        this.frozenID = setTimeout(function(){
          that.frozen = false ;
        }, S.poweruplist[4].duration); // settings.js
      } else {
      var that = this; // store the this so that we can see it in the anon function in the timeout
      this.frozen = true;
      this.frozenID = setTimeout(function(){
        that.frozen = false ;
      }, S.poweruplist[4].duration); // settings.js
      }
    }else 
    if(type == "psyMode"){
      S.clearBG = false; 
      setTimeout(function(){
        S.clearBG = true ;
      }, S.poweruplist[5].duration); // settings.js
    }else 
    if(type == "length"){
      var length = round(this.len/4);
      this.relength(length);
    }else   
    if(type == "star"){
      //right now this is star mode, you cant be killed BUT YOU CAN KILL!!!!

      // setTimeout does not like to be called twice; clear existing setTimeout if one is running.
      if (this.star == true){
        clearTimeout(this.starID);
        var that = this; // store the this so that we can see it in the anon function in the timeout
        this.starID = setTimeout(function(){
          that.star = false ;
        }, S.poweruplist[0].duration); // settings.js
      } else {
      var that = this; // store the this so that we can see it in the anon function in the timeout
      this.star = true;
      this.starID = setTimeout(function(){
        that.star = false ;
      }, S.poweruplist[0].duration); // settings.js
      }
    }
  };

  // this needs to be changes so it not chekcing if we his someone else, the desroy oursleves, it should be if someone else hit us destroy them and add a point.
  this.collision = function(){
    var x = this.segment[0][0];
    var y = this.segment[0][1];
    var w = this.bikeSize;
    var id = this.playerID;

    if(this.ghost == true) return;
    if(this.star == true) return;

    // loop through all players
    dance:
    for(var i=0; i<players.length; i++){
      if (players[i] == null) continue;
      var player = players[i];
        if(player.ghost == true) continue;      // check if powerup ghost
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
                // we killed the other player so we get a point
                this.score++;
                playerManager.updatePlayer(this);
              }
              // destroy yourself, unless you are mario star
              this.destroy();
              
              // we died, so the player who killed us gets a point
              if (player.playerID != id){
                player.score++;
                playerManager.updatePlayer(player);
              }

              // just in case
              this.updateUI();
              player.updateUI();

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
  			return this.destroy(true);
  		}
  	} 

  	if (this.x < 0 && this.direction === _LEFT){//off the left side
  		if (mode === 'loop' || mode === 'horizLoop'){
  			this.x = width; //loop to right side
  		}
  		if (mode === 'destroy' || mode === 'vertLoop'){
  			return this.destroy(true);
  		}
	}

  	if (this.y > height && this.direction === _DOWN){ // off the bottom
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = 0 -this.bikeSize; //loop to top
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
        return this.destroy(true);
  		}
  	}

  	if (this.y < 0 && this.direction === _UP){ // off the top
  		if (mode === 'loop' || mode === 'vertLoop'){
  			this.y = height; //loop to bottom
  		}
  		if (mode === 'destroy' || mode === 'horizLoop'){
  			return this.destroy(true);
  		}
  	}
  }; //close edgeDetection


  this.destroy = function(hammerOfThor){
    // if we have power star, we can't die :D WHOOP!
    if (this.star == true && hammerOfThor == null) return;

    this.updateUI();

    // 1. find the player in players array with this.playerID
    // 2. remove that player from the players array
    // 3. add next player from the queue to the same index in the players array
    var id = this.playerID;
    var index = null;

    for (var i=0; i<players.length; i++){
      var p = players[i];
      if(p && p.playerID == id) index = i;
    }

    players[index] = null;

    // if team play. change total team player count with destroy. 
    if (S.teamPlay){
      if (this.team = 1){
          team1count--;
      } else if (this.team = 2){
          team2count--;
      } else if (this.team = 3){
          team2count--;
      } 
    }
    var np = netPlayers[id];
    np.sendCmd('display', '#waiting');
    np.sendCmd('destroySound', 'boom'); // send the destroy sound to the controller.

  };


} // close Bike class