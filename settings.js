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

  //WORLD PARAMS
  soundOn: true,        // true: play sounds. false: no sounds
  clearBG: true,         // clear the background? leave trails? (does not change hit detection)
  loopMode: 'horizLoop', // loop, destroy, horizLoop, vertLoop
  gameStarted: false,    // true: the game is being played. false: not playing
  bgColor: 0,            // default background color

  drawPowerup: 60,       // how often to refresh the powerups, lower is faster
  numPU: 10,             // how many powerups to display at any one time?
  rand_freqPU: 1,       // adds randomness of powerup refresh to the total # onscreen. 0 = inactive; 1 = infrequent; 5 = frequent 


  poweruplist: [
  {
    'name': 'star', 
    'freq': 1,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 10000 },  // how long the powerup efects the player in millis

  {
    'name': 'size',
    'freq': 5,            // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'scale': 2 },         //the size multiplier ex. 2 == 2x bigger or smaller than bikesize

  {
    'name': 'ghost',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 5000 },  // how long the powerup efects the player in millis

  {
    'name': 'length',
    'freq': 0 },      // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent

  {
    'name': 'freeze',
    'freq': 3,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 2000 }, // how long the powerup efects the player in millis

  {
    'name': 'psyMode',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 2000 },  // how long the powerup efects the player in millis
],

};

// master settings list for powerups. is this a good location for this? thoughts?
// this should probably be moved into S, but can't think of a good way to do this.

// a current limitation is that the names of the powerups need to correspond with names in bike.js and gamegrid.js
                                                

