/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

// Require will call this with GameServer, GameSupport, and Misc once
// gameserver.js, gamesupport.js, and misc.js have loaded.

requirejs.config({
  paths: {
    lockr : '../bower_components/lockr/lockr',
    jquery: '../scripts/jquery'
  }
});

// Start the main app logic.
requirejs([
    'hft/gameserver',
    'hft/gamesupport',
    'hft/misc/misc',
    'jquery',
    'lockr'
  ], function(GameServer, GameSupport, Misc, jq, lockr) {
    var globals = {
      debug: false,
      askName:false,
      menu:false,
    };

    var g_readyToPlay = true; // false: waiting, true: join

    Misc.applyUrlSettings(globals);
    
    // Get the Highscores from localStorage
    var _hs = lockr.get('hs');
    if (_hs && _hs.kill) masterKillList = _hs.kill;
    if (_hs && _hs.time) masterSurvivalList = _hs.time;
    
    // you can call this from the console to clear the highscores list
    window.clearDb = function(){
      masterKillList = [];
      masterSurvivalList = [];
      for(var i=0; i<10; i++){
        masterKillList.push({score:0, name: '', id: 0 });
        masterSurvivalList.push({time:0, name: '', id: 0 });
      }
      lockr.flush();
    };
    // access Lockr from the console too
    window.Lockr = lockr;


    var Player = function(netPlayer, name, uuid) {
      this.netPlayer = netPlayer;
      if (name) this.name = name;
      this.id = uuid;
      
      this.bike = new bike(netPlayer, this.name, this.id, S.playerSize, S.playerLength);
      this.color = this.bike.color;
      
      netPlayers[uuid] = this.netPlayer;

      // set the controller background color
      netPlayer.sendCmd('setColor', this.color);

      netPlayer.addEventListener('GO', Player.prototype.GO.bind(this));
      netPlayer.addEventListener('joinGame', Player.prototype.joinGame.bind(this));
      
      netPlayer.addEventListener('disconnect', Player.prototype.disconnect.bind(this));
      netPlayer.addEventListener('move', Player.prototype.movePlayer.bind(this));
      netPlayer.addEventListener('color', Player.prototype.setColor.bind(this));
      // this is how we really change your player name:
      netPlayer.addEventListener('ggName', Player.prototype.ggName.bind(this));
      netPlayer.addEventListener('busy', Player.prototype.busy.bind(this));

      // netPlayer.addEventListener('gameLog', function(message){
      //   console.log("controllerLog:", message);
      // });


    };

    Player.prototype.GO = function() {
      this.bike.go();
    };

    Player.prototype.joinGame = function() {
      this.bike = new bike(this.netPlayer, this.name, this.id, S.playerSize, S.playerLength);
      this.netPlayer.sendCmd('setColor', this.bike.color);
      var setBike = false;
      for(var i=0; i<players.length; i++){
        if (players[i] == null){
          players[i] = this.bike;
          setBike = true;
          break;
        }
      }
      // ensure there are only ever S.maxPlayers in the players array
      // by not pushing new players when the limit is reached
      if (setBike == false && players.length < S.maxPlayers) players.push(this.bike);

      this.bike.joinGame();
    };

    // The player disconnected.
    Player.prototype.disconnect = function() {
      this.bike.destroy();
    };

    Player.prototype.movePlayer = function(dir) {
      if (this.bike.direction == _LEFT && dir == _RIGHT) return;
      if (this.bike.direction == _RIGHT && dir == _LEFT) return;

      if (this.bike.direction == _UP && dir == _DOWN) return;
      if (this.bike.direction == _DOWN && dir == _UP) return;

      this.bike.direction = dir;
      
    };
    Player.prototype.setColor = function(cmd) {};

    Player.prototype.ggName = function(o) {
      if(!o.name || o.name === "") return;
      this.name = o.name;
      this.bike.name = o.name;
    };

    Player.prototype.busy = function(cmd) {};

    var server = new GameServer();
    GameSupport.init(server, globals);

    // A new player has arrived.
    server.addEventListener('playerconnect', function(netPlayer, name) {
      // leaving the setName method that is used by HFT 
      netPlayer.addEventListener('setName', function(){});

      netPlayer.sendCmd('getCookie', uuid())
      netPlayer.addEventListener('createPlayer', function(data){
        // create a new player
        new Player(netPlayer, data.name, data.uuid);
      })
    });


    //send out the kills to all the controllers
    setInterval(function(){
      server.broadcastCmd('recHighScores', updateMasterScoreList());
      // save the highscores list (to localStorage)
      var data = {
        kill: masterKillList,
        time: masterSurvivalList 
      };
      lockr.set('hs', data);
    }, 1500);

    GameSupport.run(globals, hft_draw);

    setInterval(function(){
      var player_count = 0;
      for(var i=0; i<players.length; i++){
        if (players[i] != null) player_count++;
      }

      //
      if(player_count < S.maxPlayers){
        //if we are under out s.Maxplayers and we are waiting then change to join.
        if (g_readyToPlay == false){
          server.broadcastCmd('joinButtonActive', true);
        }
        g_readyToPlay = true;
      // if we are over or = to s.maxplayers then set it to wait status, unless we are already in wait status.
      } else {
        if (g_readyToPlay == true){
          server.broadcastCmd('joinButtonActive', false); 
        }
        g_readyToPlay = false;
      }

      

    }, 500);

});


// console.log("∆∆∆∆∆∆∆∆∆∆∆∆ GAME GRID ∆∆∆∆∆∆∆∆∆∆∆∆");
// console.log("derek anderson, john kim, ben moren");


