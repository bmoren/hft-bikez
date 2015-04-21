//
// queue.js
// the list manages people who have connected to HFT with their phone
// and will determine who is playing or who is waiting to play
//
var Queue = function(){
	this.waitingList = [];
	
	// S.maxPlayers <-- how many players can play at once

	this.add = function(player){
		// add to the players array
		players.push( player );

		player.ready();
		player.go();
		
		// or add to the waitingList depending on S.maxPlayers

	}

	this.addToGame = function(index){
		var player = this.waitingList.shift();
		players[index] = player;
		// update state of the player to 'being rendered'
	};

};