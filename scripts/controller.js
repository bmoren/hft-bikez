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
  ], function(
    CommonUI,
    GameClient,
    Input,
    Misc,
    MobileHacks,
    Touch) {

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
  var $ = document.getElementById.bind(document);

  // bind events to html buttons
  Touch.setupButtons({
    inputElement: $("buttons"),
    buttons: [
      { element: $("button-up"), callback: buttonUp, },
      { element: $("button-down"), callback: buttonDown, },
      { element: $("button-left"), callback: buttonLeft, },
      { element: $("button-right"), callback: buttonRight, },
    ],
  });

  // dom elements for status message and background color
  var statusElem = $("gamestatus");
  var colorElem = $("display");

  var client = new GameClient();

  // Note: CommonUI handles these events for almost all the samples.
  var onConnect = function() {
    statusElem.innerHTML = "you've connected to happyFunTimes";
  };

  var onDisconnect = function() {
    statusElem.innerHTML = "you were disconnected from happyFunTimes";
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
  // Set the controllers background color!
  //
  client.addEventListener('setColor', function(c){
    console.log('setting color to ', String(c))
    colorElem.style.backgroundColor = c.colorString;
  });


});

