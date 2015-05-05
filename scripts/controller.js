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
    '../jquery'
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
      debug: true,
    };

    // somehow these are not included in the controller app thing
    var _UP    = 1;
    var _DOWN  = 2;
    var _LEFT  = 3;
    var _RIGHT = 4;

    Misc.applyUrlSettings(globals);
    MobileHacks.fixHeightHack();

    // fake jquery selectors
    // var $ = document.getElementById.bind(document);

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

    var client = new GameClient();

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

      var r = c.rgba[0];
      var g = c.rgba[1];
      var b = c.rgba[2];

      var inverseColor = inverseRGB(r,g,b)

      $('.button').css("border-color", inverseColor);
      $('#buttons span').css("color", inverseColor);

    });

    client.addEventListener('recHighScores', function(scores){
        //console.log(scores);

        // add the names and score for the Kill List
        $('#killNames div').each(function(i){
          $(this).text( scores[0][i].name );
        })

        $('#killList div').each(function(i){
          $(this).text( scores[0][i].score );
        })

        // add the names and score for the Survival List
        $('#survivalNames div').each(function(i){
          $(this).text( scores[1][i].name );
        })

        $('#survivalList div').each(function(i){
          $(this).text( readableMS(scores[1][i].time) );
        })

    }); //close recHighScores event listener

  });

  //for thesting the high score screen
  window.display = function(){
    $('#waiting, #playing').toggleClass('active')
  }

  

});



