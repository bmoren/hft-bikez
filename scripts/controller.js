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

  var client = new GameClient();

  // Note: CommonUI handles these events for almost all the samples.
  var onConnect = function() {
    statusElem.innerHTML = "you've connected to Game Grid";
  };

  var onDisconnect = function() {
    statusElem.innerHTML = "you were disconnected from Game Grid";
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


  // Selecting DOM elements for variouse busisness below!
  var statusElem = $("gamestatus");
  var colorElem = $("buttons");
  var buttonBorder = document.getElementsByClassName('button');
  var buttonArrows = document.getElementsByTagName('span');


  //
  // Set the controllers colors!
  //
  client.addEventListener('setColor', function(c){
    //console.log('setting color to ', String(c.colorString))
    colorElem.style.backgroundColor = c.colorString;

    var r = c.rgba[0];
    var g = c.rgba[1];
    var b = c.rgba[2];

    var inverseColor = inverseRGB(r,g,b)

    for(var i = 0; i < buttonBorder.length; i++) {
      buttonBorder[i].style.borderColor = inverseColor;
    }

    for(var i = 0; i < buttonArrows.length; i++) {
      buttonArrows[i].style.color = inverseColor;
    }

  });


  //Build and display highScore Lists..... (this seems overly complicated)
  var killList = $("killList");
  var killNames = $("killNames");
  var survivalList = $("survivalList");
  var survivalNames = $("survivalNames");

  client.addEventListener('recHighScores', function(scores){
      // console.log(scores);

      // scores[0]; //kills list
      var tempKillList = document.createElement('div');
      var tempKillListName = document.createElement('div');
      // scores[1]; //survival list
      var tempSurvivalList = document.createElement('div');
      var tempSurvivalListName = document.createElement('div');

      //these loops could probubly be collapsed since their both 10 long....
      for(var i =0; i < scores[0].length; i++){
        var name = String(scores[0][i].name);
        var points = scores[0][i].score;
        // console.log(name,points);

              // Create the tempKillList item:
              var item = document.createElement('div');
              var item2 = document.createElement('div');
              // Set its contents:
              item2.appendChild(document.createTextNode(name.substring(0, 10)));
              item.appendChild(document.createTextNode(points));
              // Add it to the tempKillList:
              tempKillListName.appendChild(item2);
              tempKillList.appendChild(item);
      }

      //console.log(tempKillList);
      killList.innerHTML = nodeToString(tempKillList);
      killNames.innerHTML = nodeToString(tempKillListName);


      for(var i =0; i < scores[1].length; i++){
        var name = String(scores[1][i].name);
        var time = readableMS(scores[1][i].time);
        // console.log(name,points);

              // Create the list item:
              var item = document.createElement('div');
              var item2 = document.createElement('div');
              // Set its contents:
              item.appendChild(document.createTextNode(time));
              item2.appendChild(document.createTextNode(name.substring(0, 10)));
              // Add it to the list:
              tempSurvivalList.appendChild(item);
              tempSurvivalListName.appendChild(item2);
      }

      //console.log(list);
      survivalList.innerHTML = nodeToString(tempSurvivalList);
      survivalNames.innerHTML = nodeToString(tempSurvivalListName);






  }); //close recHighScores event listener



});

