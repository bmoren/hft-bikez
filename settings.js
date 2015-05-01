//
// Game Settings
// 
// note: save this file as settings.js
// 
var S = {
  //PLAYERS
  maxPlayers: 2,         // how many players
  playerLength: 40,      // length of the players, length also effects speed (length greatly affects framerate capability)
  playerSize: 10,        // how big are the players
  drawFrame: 3,          // speed to render the players, lower is faster 

  //POWERUPS
  poweruplist: [
     'size',              // (works) Changes the players size and speed
    // 'ghost',             // cannot kill or be killed
     'freeze',            // (works) Stop in place for a short while
    //'psyMode',           // stop background refresh for a short while
    // 'length',            // (works) adds or subtracts length of tail
     'star'                // mario star invincibility
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

// master settings list for powerups. is this a good location for this? thoughts?
// this should probably be moved into S, but can't think of a good way to do this.

// name should probably change because of conflict with other powerup array

var poweruplist = [
  {
    'name': 'star', 
    'freq': 3,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'appear': 10000,
    'duration': 10000,
    'accelerate': false},

  {
    'name': 'size',
    'freq': 5,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'appear': 10000,    // how long should the powerup be displayed in millis
    'duration': 10000,  //  how long the powerup lasts
    'accelerate': false},   // accelerated game play. more powerups. maybe a future option?

  {
    'name': 'ghost',
    'freq': 3,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'appear': 10000,    // how long should the powerup be displayed in millis
    'duration': 5000,  // how long the powerup lasts
    'accelerate': false},   // accelerated game play. more powerups. maybe a future option?

  {
    'name': 'length',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'appear': 10000,    // how long should the powerup be displayed in millis
    'duration': 10000,  // how long the powerup lasts
    'accelerate': false},    // accelerated game play. more powerups. maybe a future option?

  {
    'name': 'freeze',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'appear': 10000,    // how long should the powerup be displayed in millis
    'duration': 2000,  // how long the powerup lasts
    'accelerate': false},    // accelerated game play. more powerups. maybe a future option?

  {
    'name': 'psyMode',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'appear': 10000,    // how long should the powerup be displayed in millis
    'duration': 2000,  // how long the powerup lasts
    'accelerate': false}    // accelerated game play. more powerups. maybe a future option?

];
