//
// Game Settings
// 
// note: 
// this is the standard settings file, copy this file as settings.js as to not manipulate  
// someone elses settings with each git push/pull.
// settings.js should be in the .gitignore
var S = {
  //PLAYERS
  maxPlayers: 2,         // how many players
  playerLength: 40,      // length of the players, length also effects speed (length greatly affects framerate capability)
  playerSize: 20,        // how big are the players
  drawFrame: 5,          // speed to render the players, lower is faster 
  displayNames: true,     // display player names?
  releaseTime: 15000,    // how long until they autorelease on the ready/waiting screen.

  //WORLD PARAMS
  soundOn: false,         // play sounds (server and handset)
  clearBG: true,         // clear the background? leave trails? (does not change hit detection)
  loopMode: 'horizLoop', // loop, destroy, horizLoop, vertLoop
  gameStarted: false,    // true: the game is being played. false: not playing
  bgColor: 0,            // default background color

  drawPowerup: 60,       // how often to refresh the powerups, lower is faster
  numPU: 8,             // how many powerups to display at any one time?
  rand_freqPU: 1,       // adds randomness of powerup refresh to the total # onscreen. 0 = inactive; 1 = infrequent; 5 = frequent 
  powerupSize: 3,       // multiplier of the PU size (based on bike size), bigger = bigger, default = 3

  playerNameSize: 24,   // player name size on the screen

  poweruplist: [
  {
    'name': 'star', 
    'freq': 5,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 10000 },  // how long the powerup efects the player in millis

  {
    'name': 'size',
    'freq': 5,            // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'scale': 2 },         //the size multiplier ex. 2 == 2 times bigger or smaller than bikesize

  {
    'name': 'ghost',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 5000 },  // how long the powerup efects the player in millis

  {
    'name': 'length',
    'freq': 0 },      // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent

  {
    'name': 'freeze',
    'freq': 5,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 2000 }, // how long the powerup efects the player in millis

  {
    'name': 'psyMode',
    'freq': 0,          // how frequently to create this powerup. 0 = inactive; 1 = infrequent; 5 = frequent
    'duration': 2000 },  // how long the powerup efects the player in millis
],

};

