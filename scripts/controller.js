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

// Start the main app logic.
requirejs([
    'hft/commonui',
    'hft/gameclient',
    'hft/misc/input',
    'hft/misc/misc',
    'hft/misc/mobilehacks',
    'hft/misc/touch',
    'jquery',
    '../jquery.cookie',
    '../bower_components/hft-utils/dist/audio',
  ], function(
    CommonUI,
    GameClient,
    Input,
    Misc,
    MobileHacks,
    Touch,
    jq,
    jqCookie,
    AudioManager) {

  $(function(){  // onload start jQuery


    var emojiArray = function (str) {
      var spliz = String(str).split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
      var arr = [];
      for (var i=0; i<spliz.length; i++) {
        var chr = spliz[i]
        if (chr !== "") {
          arr.push(chr);
        }
      }
      return arr;
    };

    var globals = {
      debug: false,
      orientation: "landscape-primary",
    };

    // somehow these are not included in the controller app thing
    var _UP    = 1;
    var _DOWN  = 2;
    var _LEFT  = 3;
    var _RIGHT = 4;

    var client = new GameClient();

    var ticker = null;
    var joinIsActive = true; //join on is the default!
    var joinPressed = false; 
    var screenOrientation = 0;
    var g_audioManager;

    var sounds = {
      explosion: {
        filename: "assets/boom.mp3",
        samples: 1,
      },
      buttonPress: {
        filename: "assets/beep.mp3",
        samples: 1,
      },
      powerUp: {
        filename: "assets/powerup.mp3",
        samples: 1,
      }
    };

    g_audioManager = new AudioManager(sounds);


    ///////////////// jQuery things, listening for button presses, etc

    // set some cookie defaults so they don't expire
    $.cookie.defaults.expires = 365;

    Misc.applyUrlSettings(globals);
    MobileHacks.fixHeightHack();

    // bind events to html buttons
    Touch.setupButtons({
      inputElement: $("#buttons")[0],
      buttons: [
        { element: $("#button-up")[0], callback: buttonUp, },
        { element: $("#button-down")[0], callback: buttonDown, },
        { element: $("#button-left")[0], callback: buttonLeft, },
        { element: $("#button-right")[0], callback: buttonRight, },
      ],
    });

    Touch.setupButtons({
      inputElement: $('#readyToPlay')[0],
      buttons: [
        { element: $('#readyToPlayBtn')[0], callback: joinBtnEvent }
      ]
    })

     Touch.setupButtons({
      inputElement: $('#go')[0],
      buttons: [
        { element: $('#goBtn')[0], callback: goBtnEvent }
      ]
    })

    Touch.setupButtons({
      inputElement: $('#enterName')[0],
      buttons: [
        { element: $('#inputNameDone')[0], callback: nameBtnEvent }
      ]
    })

    // change your name by clicking on the name in the UI
    $('#playerNM').click(function(){
      display('#enterName');
    })

    // //utility to log to the game console from the controller
    // function glog(message){
    //   client.sendCmd('gameLog', message);
    // }


    // Note: CommonUI handles these events for almost all the samples.
    var onConnect = function() {
      $("#gamestatus").text("you've connected to Game Grid");
    };

    var onDisconnect = function() {
      $("#gamestatus").text("you were disconnected from Game Grid");
    }

    // Because I want the CommonUI to work
    globals.disconnectFn = onDisconnect;
    globals.connectFn = onConnect;

    CommonUI.setupStandardControllerUI(client, globals);

    function joinBtnEvent(){
      if(joinPressed == true) return;
      display('#go');
      client.sendCmd('joinGame');
      countDown();
      joinPressed = true;
      if (S.soundOn) {
        g_audioManager.playSound('buttonPress');
      }
    }

    function goBtnEvent(){
      display('#playing');
      client.sendCmd('GO');
      clearCountdown();
      //reset the debounce for next time
      joinPressed = false;
      if (S.soundOn) {
        g_audioManager.playSound('buttonPress');
      }
    };

    // show a name from mortal kombat, but reduce it to 6 characters
    // $('#inputName').val( (MortalKombat.get()).substr(0,6) );

    $('#inputName').val('');

    // $('#inputName').focus(function() {
    //   this.value = "";
    // });

    function nameBtnEvent(){
      var newName = $('#inputName').val();
      // trim leading / trailing whitespace
      newName = newName.replace(/(^\s+|\s+$)/g,'');

      // if the user chooses a Crown for the first character in the name
      // replace it with a poop.
      var crown = emojiArray(newName);

      if (crown[0] == '👑'){
        newName = newName.substring(2);
        newName = '💩'+newName;
      }

      // enable cheat mode
      if (newName.toUpperCase() == 'G3G2G1'){
        client.sendCmd('enableCheatMode', true);
      }

      // no name was chosen, try again?!
      if (newName == "") return;

      $.cookie('gg_name', newName);
      client.sendCmd('ggName', {name: newName});
      display('#waiting');
      if (S.soundOn) {
        g_audioManager.playSound('buttonPress');
      }
    }

    //
    // the sickest shit you ever seen bro
    //
    function buttonUp(){
      client.sendCmd('move', _UP);
    };
    function buttonDown(){
      client.sendCmd('move', _DOWN);
    };
    function buttonLeft(){
      client.sendCmd('move', _LEFT);
    };
    function buttonRight(){
      client.sendCmd('move', _RIGHT);
    };

    //
    // Set the controllers colors!
    //
    client.addEventListener('setColor', function(c){
      //console.log('setting color to ', String(c.colorString))
      $('#goBtn').css("background-color", c.colorString) ;
      $('#wormBody').css("background-color", c.colorString) ;

      var r = c.rgba[0];
      var g = c.rgba[1];
      var b = c.rgba[2];

      var inverseColor = inverseRGB(r,g,b)

      $("#buttons").css("background-color", c.colorString) ;

      $('.button').css("background", inverseColor);
      $('.button').css("border-color", c.colorString);
      $('#buttons span').css("color", c.colorString);
      
      $('#goBtn').css("color", inverseColor);
      $('#wormHead').css("background-color", inverseColor);
    });

    client.addEventListener('updateUI', function(data){
      $('#playerNM').text(data.name);
      $('#playerHS').text(data.score);
      $('#playerRank').text(data.rank);
    })


    client.addEventListener('getCookie', function(uuid){
      var name = $.cookie('gg_name');
      var newPlayer = false;
      // try to get the cookie
      var player_uuid = $.cookie('gg_uuid');
      // otherwise, bake some cookies with the provided uuid
      if (!player_uuid){
        $.cookie('gg_uuid', uuid);
        player_uuid = uuid;
        newPlayer = true;
        // show the enterName screen for "new" players
        display('#enterName');
      }

      if (!name){
        display('#enterName');
      }

      // send a message back to the game.js to create the new player
      var options = {
        uuid: player_uuid,
        new_player: newPlayer,
        name: name
      };
      client.sendCmd('createPlayer', options);
    });

    // Wait for a message to display a specific "screen"
    client.addEventListener('display', function(stuff){
      display(stuff)
    });

    //play the destroy sound locally if they die.
    client.addEventListener('destroySound', function(){
      joinPressed = false;
      if (S.soundOn) {
        g_audioManager.playSound('explosion');
      }
    });
    // play the powerup sound locally when they get a power up
    client.addEventListener('powerupSound', function(){
      if (S.soundOn) {
        g_audioManager.playSound('powerUp');
      }
    });

    client.addEventListener('updateHighScores', function(scores){
      if ($('#waiting').hasClass('active') == false){
        return;
      }
      for(var i=0; i<scores.length; i++){
        var x = $('#hs'+ i);
        var s = scores[i];
        if (!s) continue;

        var name = scores[i][0];
        var score = scores[i][1] || 0;

        name = String(name).trim()
        var name_array = emojiArray(name);
        var _name = [];
        for(var j=0; j<6; j++){
          var _n = name_array[j];
          if (typeof _n != 'undefined') _name.push(name_array[j])
        }

        $('.hs-name', x).text( _name.join('') );
        $('.hs-score', x).text( score );
      }
    });

    client.addEventListener('clearCookies', function(){
      clearCookies();
    })

    // client.addEventListener('recHighScores', function(scores){
        //console.log(scores);

        // // add the names and score for the Kill List
        // $('#killNames div').each(function(i){
        //   $(this).text( String(scores[0][i].name).toUpperCase() );
        // })

        // $('#killList div').each(function(i){
        //   $(this).text( scores[0][i].score );
        // })

        // // add the names and score for the Survival List
        // $('#survivalNames div').each(function(i){
        //   $(this).text( String(scores[1][i].name).toUpperCase() );
        // })

        // $('#survivalList div').each(function(i){
        //   $(this).text( readableMS(scores[1][i].time) );
        // })

    // }); //close recHighScores event listener



    // client.addEventListener('joinButtonActive', function(active){
    //   if(active == true){
    //    $('#readyToPlayBtn').text("JOIN!");
    //   }else{
    //    $('#readyToPlayBtn').text("WAIT.");
    //   }
    //   joinIsActive = active;
    // });
  
    //count down until they are auto released for display on the controller (THIS IS GLITCHY)
    function countDown(){
      var countdown = S.releaseTime/1000;
        ticker = setInterval(function(){
          countdown --;
          if (countdown <= 0){
            // reset
            clearCountdown();
          }else{
          $('#countdown').text(countdown);
          } 
        }, 1000);
      }

      function clearCountdown(){
        if(ticker != null){
          clearInterval(ticker);
          ticker = null;
          $('#countdown').text(" ");
          display('#playing');
        }
      }

  }); //close jQuery onready


  //what controller 'page' to show?
  window.display = function(type){
    $('#waiting, #playing, #go, #enterName').removeClass('active');
    $(type).addClass('active');
  }

  window.clearCookies = function(){
    $.removeCookie('gg_uuid');
    $.removeCookie('gg_name');
  }


}); // the requirejs closure ends here...
