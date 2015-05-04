
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
var powerups = [];
var postSetup = false ;

var masterKillList = [];
var masterSurvivalList = [];


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
  calculate_powerup_frequency(); // calculates frequenies for powerups

  for(var i=0; i<10; i++){
    masterKillList.push({score:0, name: '', id: 0 });
    masterSurvivalList.push({time:0, name: '', id: 0 });
  }

  postSetup = true ; 

};



// this is dead space, p5 eats a chilidog here. 
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
      for (var i=0;i<poweruplist.length;i++){
        running_freqcount = running_freqcount + poweruplist[i].freq;
        if (seed_num <= (running_freqcount/S.total_freqPU)) {
          powerups.push(new powerUp(poweruplist[i].name));
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
  //     powerups.push(new powerUp(poweruplist[choosePU].name));
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

  for(var x = 0; x < results.length; x++){
    var hsPlayer = results[x];
    // Q: are we on the list?
    if (playerStats.id == hsPlayer.id){
      // A: yes we are on the list!
      onTheList = x;
      break;
    }
  }

  // Try to add us to the master kill list!@!@!@!@!@### X_X_X
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
      if (x == 0){
        // we are the leader already, but we got a better score so update it!
        results[x] = playerStats;
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



