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
    '../jquery.cookie'
  ], function(
    CommonUI,
    GameClient,
    Input,
    Misc,
    MobileHacks,
    Touch,
    jq) {

  $(function(){

    var globals = {
      debug: false,
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

    // 
    // jQuery things, listening for button presses, etc
    // 

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

    //utility to log to the game consol from the controller
    function glog(message){
      client.sendCmd('gameLog', message);
    }


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
      if(joinIsActive == false || joinPressed == true) return;
      display('#go');
      client.sendCmd('joinGame');
      countDown();
      glog("join clicked");
      joinPressed = true;
      if (S.soundOn) $('#beepSound').get(0).play();

    }

    function goBtnEvent(){
      display('#playing');
      client.sendCmd('GO');
      clearCountdown();
      //reset the debounce for next time
      joinPressed = false;
      if (S.soundOn) $('#beepSound').get(0).play();
    };

    // show a name from mortal kombat, but reduce it to 6 characters
    $('#inputName').val( (MortalKombat.get()).substr(0,6) );

    $('#inputName').focus(function() {
      this.value = "";
    });

    function nameBtnEvent(){
      var newName = $('#inputName').val();
      $.cookie('gg_name', newName);
      client.sendCmd('name', {name: newName});
      display('#waiting');
      if (S.soundOn) $('#beepSound').get(0).play();


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
      $("#buttons").css("background-color", c.colorString) ;
      $('#goBtn').css("background-color", c.colorString) ;
      $('#wormBody').css("background-color", c.colorString) ;

      var r = c.rgba[0];
      var g = c.rgba[1];
      var b = c.rgba[2];

      var inverseColor = inverseRGB(r,g,b)

      $('.button').css("border-color", inverseColor);
      $('#buttons span').css("color", inverseColor);
      $('#goBtn').css("color", inverseColor);
      $('#wormHead').css("background-color", inverseColor);

    });

    client.addEventListener('getCookie', function(uuid){
      var name = $.cookie('gg_name') || 'X';
      var newPlayer = false;
      // try to get the cookie
      var player_uuid = $.cookie('gg_uuid');
      // otherwise, bake some cookies with the provided uuid
      if (!player_uuid){
        $.cookie('gg_uuid', uuid);
        player_uuid = uuid;
        newPlayer = true;
      }
      // limit peeps from messing with our name cookie!
      if (name) name = name.substr(0, 6);
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
      if (S.soundOn) $('#boomSound').get(0).play();
    });

    client.addEventListener('recHighScores', function(scores){
        //console.log(scores);

        // add the names and score for the Kill List
        $('#killNames div').each(function(i){
          $(this).text( String(scores[0][i].name).toUpperCase() );
        })

        $('#killList div').each(function(i){
          $(this).text( scores[0][i].score );
        })

        // add the names and score for the Survival List
        $('#survivalNames div').each(function(i){
          $(this).text( String(scores[1][i].name).toUpperCase() );
        })

        $('#survivalList div').each(function(i){
          $(this).text( readableMS(scores[1][i].time) );
        })

    }); //close recHighScores event listener



    client.addEventListener('joinButtonActive', function(active){
      if(active == true){
       $('#readyToPlayBtn').text("JOIN!");
      }else{
       $('#readyToPlayBtn').text("WAIT.");
      }
      joinIsActive = active;
    });
  
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


});



