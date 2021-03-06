
//
// Game.js
// 
//

//Constants
var _UP    = 1;
var _DOWN  = 2;
var _LEFT  = 3;
var _RIGHT = 4;
var frames = 0;
var playerColor;
var players = [];

var netPlayers = {};

var powerups = [];
var postSetup = false ;
var total_freqPU = 0;      // calculates frequencies of powerups 

//the singularity storage
// note: these get updated in game.js from the highscores db server
var masterKillList = [];
var masterSurvivalList = [];

var sizeIcon;
var freezeIcon;
var starIcon;



var PlayerManager = function(save){
  this.players = {};
  this.save = save || false;

  if (save){
    var x = Lockr.get('playerManager');
    this.players = x || {};
  } else {
    Lockr.set('playerManager', null);
  }

  this.addPlayer = function(player){
    var data = {
      playerID: player.playerID,
      name: player.name,
      score: player.score,
      time: player.createdTime
    };
    this.players[ player.playerID ] = data;
    if (this.save){
      this.savePlayers()
    }
    return this.players;
  }

  this.updatePlayer = this.addPlayer;

  this.getPlayer = function(id){
    return this.players[id] || null;
  }

  this.sortPlayers = function(){
    var p = this.players;
    var results = [];
    var _players = [];
    for(var player in p){
      _players.push( p[player] );
    }
    // sort players based on score
    _players = _players.sort(function(a,b){
      return a.score > b.score ? -1 : 1;
    })
    // group players by score
    _players = _.groupBy(_players, 'score');
    for(var num in _players){
      var x = _players[num];
      // sort the "tied" players by most recently joined the game.
      x = x.sort(function(a,b){ return Number(a.time) > Number(b.time) ? 1 : -1; });
      // add them to the results array
      for(var i=0; i<x.length; i++){
        results.push( x[i] )
      }
    }

    return results.reverse();
  }

  this.sortScores = function(){
    var x = this.sortPlayers();
    var result = [];
    for(var i=0; i<x.length; i++){
      var player = x[i];
      result.push( [player.name, player.score] );
    }
    return result;
  }

  this.topTenScores = function(){
    var x = this.sortScores();
    return _.slice(x, 0, 10);
  }

  this.logScores = function(){
    var x = this.sortScores();
    for(var i=0; i<x.length; i++){
      console.log(x[i][0], x[i][1] );
    }
  }

  this.savePlayers = function(){
    Lockr.set('playerManager', this.players);
    return true;
  }

  this.getRank = function(id){
    var x = this.sortPlayers();
    var rank = -1;
    for(var i=0; i<x.length; i++){
      if (x[i].playerID == id){
        rank = i+1;
        break;
      }
    }
    return rank;
  }

  this.reset = function(){
    Lockr.set('playerManager', null);
    this.players = {};
    return true;
  }

  this._fakeData = function(){
    for(var i=0; i<30; i++){
      var d = {
        playerID: 'id-'+ (Math.random()*100) +'-'+ Date.now(),
        name: 'Player-fake-'+ i,
        score: Math.floor(Math.random()*5),
        time: Date.now() + (Math.floor(Math.random()*11))
      }
      this.addPlayer(d);
    }
  }

};




//
// Preload
//
function preload(){
};

//
// Setup
//
function setup() {
  createCanvas(windowWidth, windowHeight);
  S.bgColor = color(0,0,0);
  background(S.bgColor);
  calculate_powerup_frequency(); // calculates frequencies for powerups

  for(var i=0; i<10; i++){
    masterKillList.push({score:0, name: '', id: 0 });
    masterSurvivalList.push({time:0, name: '', id: 0 });
  }
  
  // kingIcon = loadImage("assets/king.png");
  sizeIcon = loadImage("assets/sizeup.png");
  freezeIcon = loadImage("assets/freeze.png");
  starIcon = loadImage("assets/star.png");

  postSetup = true ; 

};

// using the HFT render instead of the p5.js draw method. 
function draw(){}

//
// Draw
//
function hft_draw(init) {
  if (! postSetup) return;
  frames++;


  //render bikes to screen
  if (frames % S.drawFrame != 0) return;

  background(0);
  // background( color(0,0,0,20) ) // the real psymode!

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
    
// choose which powerup to push on the basis of freq set in settings.js
// still setting a max number of powerups via S.numPU

      var seed_num = random(); 
      var running_freqcount = 0;  // adds randomness to powerup refresh. see setting.js

      choose_powerup:
      for (var i=0;i<S.poweruplist.length;i++){
        running_freqcount = running_freqcount + S.poweruplist[i].freq;
        if (seed_num <= (running_freqcount/total_freqPU)) {
          powerups.push(new powerUp(S.poweruplist[i].name));
          //console.log(powerups);
          //trim back to the total allowable amount of powerups
          if(powerups.length >= S.numPU+1){
              powerups.shift();
              //powerups.pop();
            }
            break choose_powerup;
        }
      }

// see above for this choosePU
  // if (choosePU != 10) {
  //     powerups.push(new powerUp(S.poweruplist[choosePU].name));
  //     //console.log(powerups);
  //     //trim back to the total allowable amount of powerups
  //     if(powerups.length >= S.numPU+1){
  //       powerups.shift();
  //       //powerups.pop();
  //     }
  //   }
};

function updateMasterScoreList(){
  for(i=0;i<players.length; i++){
    if (players[i] == null) continue; 
    var player = players[i];
    //get survival time
    if (player.time == null) continue;
    var survivalTime = Date.now() - player.time;
    // the stats for this player
    var playerStats = {
      score: player.score,
      time: survivalTime,
      name: player.name,
      id: player.playerID
    };

    masterKillList     = updateScoreList(playerStats, 'score', masterKillList);
    masterSurvivalList = updateScoreList(playerStats, 'time', masterSurvivalList);

  } 

  return [masterKillList, masterSurvivalList];
}


function calculate_powerup_frequency(){
    for (var i=0;i<S.poweruplist.length;i++){
      total_freqPU = total_freqPU + S.poweruplist[i].freq;
    }
    total_freqPU = total_freqPU + S.rand_freqPU; 
  }


/**
 * util to update highscores list given the list to update and the type of list to update
 * 
 * @param  {object} player - the player object
 * @param  {object} playerStats - the players stats object
 * @param  {string} type - the type of list, either 'score', or 'time'
 * @param  {array} list - the list to use, (masterKillList or masterSurvivalList)
 * 
 * @return {array}
 */
function updateScoreList(playerStats, type, list){
  
  var results = list;
  var onTheList = null;

  // if the current players time is null, don't do anything
  if (playerStats[type] == null) return list;

  for(var x = 0; x < results.length; x++){
    var hsPlayer = results[x];
    // Q: are we on the list?
    if (playerStats.id == hsPlayer.id){
      // A: yes we are on the list!
      onTheList = x;
      break;
    }
  }

  // Try to add us to the highsore list
  outOfJail:
  for(var x = 0; x < results.length; x++){
    var hsPlayer = results[x];
    
    // Are we better than (or equal to) anyone on the list?
    if (playerStats[type] > hsPlayer[type]){

      // we are not on the list yet, so add us
      if (onTheList === null) {
        results.splice(x,0, playerStats);
        results.pop();
        break;
      }

      // we're on the list: 
      // are we the leader?
      if (x == 0 && onTheList == 0){
        // we are the leader already, but we got a better score so update it!
        results[0] = playerStats;
        break;
      }
      // we have the same score, let's update it anyone (accounting for name changes)
      // if (playerStats[type] == results[onTheList][type]){
      //   results[onTheList] = playerStats;
      //   break;
      // }

      // We're on the list, but we're not the leader:
      // Q: Are we better than our top score???
      if (playerStats[type] > results[onTheList][type]){
        // A: Yes
        // remove ourself from the list
        results.splice(onTheList, 1);

        // then add ourself back into the list at the right spot
        for(var y = 0; y < results.length; y++){
          var hsPlayerY = results[y];
          if (playerStats[type] >= hsPlayerY[type]){
            results.splice(y, 0, playerStats);
            break outOfJail;
          }
        }
      }
    }
  }
  return results;
}; // end of updateKillList



