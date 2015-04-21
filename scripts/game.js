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

// Start the main app logic.
requirejs([
    'hft/gameserver',
    'hft/gamesupport',
    'hft/misc/misc',
  ], function(GameServer, GameSupport, Misc) {
    
    var globals = {
      debug: true
    };

    window.queue = new Queue();

    Misc.applyUrlSettings(globals);

    var Player = function(netPlayer, name) {
      this.netPlayer = netPlayer;
      this.name = name;
      this.id = uuid();
      
      console.log( 'creating a new bike object' );
      this.bike = new bike(netPlayer, name, this.id, S.playerSize, S.playerLength);
      this.color = this.bike.color;
      
      queue.add( this.bike );
      

      // set the controller background color
      netPlayer.sendCmd('setColor', this.color);

      netPlayer.addEventListener('disconnect', Player.prototype.disconnect.bind(this));
      netPlayer.addEventListener('move', Player.prototype.movePlayer.bind(this));
      netPlayer.addEventListener('color', Player.prototype.setColor.bind(this));
      netPlayer.addEventListener('setName', Player.prototype.setName.bind(this));
      netPlayer.addEventListener('busy', Player.prototype.busy.bind(this));
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
    Player.prototype.setName = function(cmd) {};
    Player.prototype.busy = function(cmd) {};

    var server = new GameServer();
    GameSupport.init(server, globals);

    // A new player has arrived.
    server.addEventListener('playerconnect', function(netPlayer, name) {
      new Player(netPlayer, name);
    });

    GameSupport.run(globals, hft_draw);

});


