//
// Powerups
//

// **USE POWERUP IS PART OF BIKE.JS

function powerUp(type){
  this.id = Date.now();
  // square power UPS, fool
  this.size = playerSize*3;

  this.x = random(width - this.size);
  this.y = random(height - this.size);

  //types: size, ghost, freeze, psyMode, 
  this.type = type;

  this.display = function(){

    textSize(this.size - 5);

    if(this.type == 'size'){
      fill(255); // replace with flickering powerup icons!
      rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      fill(0);
      text("Sz",this.x,this.y+(this.size-3));
    }else if(this.type == 'ghost'){
      fill(255,0,255);
      rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      fill(0,255,0);
      text("Gh",this.x,this.y+(this.size-3));
    }else if(this.type == 'freeze'){
      fill(0,0,255);
      rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      fill(255,255,0);
      text("Fz",this.x,this.y+(this.size-3));
    }else if( this.type == 'psyMode'){
      fill(random(255),random(255),random(255));
      rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      fill(255);
      text("P",this.x,this.y+(this.size-3));
    }
  }

  this.remove = function(){
    //powerup gets hit, animation?
    for(var i=0; i<powerups.length; i++){
      if (powerups[i] == null) continue;
      if (powerups[i].id == this.id){
        powerups[i] = null;
      }
    }
  }
 
} //Close Powerup class
