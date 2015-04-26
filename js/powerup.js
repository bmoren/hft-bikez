//
// Powerups
//

// **USE POWERUP IS PART OF BIKE.JS

function powerUp(type){
  this.id = uuid();
  // square power UPS, fool
  this.size = S.playerSize*3;

  this.x = random(width - this.size);
  this.y = random(height - this.size);

  //types: size, ghost, freeze, psyMode, length
  this.type = type;

  this.display = function(){

    textSize(this.size - 5);

    if(this.type == 'size'){
      //fill(255); // replace with flickering powerup icons!
      //rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      fill(0);
      stroke(255);
      ellipseMode(CORNER);
      strokeWeight(5);
      ellipse(this.x, this.y, this.size, this.size)
      strokeWeight(3);
      ellipse(this.x, this.y, this.size/1.5, this.size/1.5)
      strokeWeight(2);
      ellipse(this.x, this.y, this.size/2, this.size/2)
      strokeWeight(1);
      ellipse(this.x, this.y, this.size/3, this.size/3)
      //text("Sz",this.x,this.y+(this.size-3));
    }else if(this.type == 'ghost'){
      stroke(255);
      strokeWeight(6);
      strokeJoin(ROUND);
      fill(255);
    }else if(this.type == 'freeze'){
      stroke(12,181,247);
      strokeWeight(6);
      strokeJoin(ROUND);
      fill(0);
      rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
    }else if( this.type == 'psyMode'){
      fill(random(255),random(255),random(255));
      rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      fill(255);
      text("P",this.x,this.y+(this.size-3));
    }else if(this.type == 'length'){
      text("L",this.x,this.y+(this.size-5));
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
