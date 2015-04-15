//
// Game Settings
// 
// note: save this file as settings.js
// 
var S = {
  //PLAYERS
  numPlayers: 2,         // how many players
  playerLength: 30,      // length of the players, length also effects speed (length greatly affects framerate capability)
  playerSize: 15,        // how big are the players
  drawFrame: 2,          // speed to render the players, lower is faster 

  //POWERUPS
  poweruplist: [
    'size',              // Changes the players size and speed
    'ghost',             // cannot kill or be killed
    'freeze',            // Stop in place for a short while
    'psyMode',           // stop background refresh for a short while
  ],
  drawPowerup: 60,       // how often to refresh the powerups, lower is faster
  numPU: 4,              // how many powerups to display at any one time?
  
  //BRICKS
  brickMode: true,       // turn bricks on/off completely
  numBricks: 20,          // how many bricks for players to hit/avoid?
  
  //WORLD PARAMS
  soundOn: true,        // true: play sounds. false: no sounds
  clearBG: true,         // clear the background? leave trails? (does not change hit detection)
  loopMode: 'horizLoop', // loop, destroy, horizLoop, vertLoop
  gameStarted: false,    // true: the game is being played. false: not playing
  bgColor: 0,            // default background color

};


