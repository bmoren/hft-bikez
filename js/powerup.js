//
// Powerups
//
//
// **USE POWERUP IS PART OF BIKE.JS

function powerUp(type){
  this.id = uuid();
  // square powerips only!!
  this.size = S.playerSize*S.powerupSize;

  this.x = random(width - this.size);
  this.y = random(height - this.size);

  //types: size, ghost, freeze, psyMode, length
  this.type = type;

  this.display = function(){

    textSize(this.size - 5);

    if(this.type == 'size'){
      //fill(255); // replace with flickering powerup icons!
      //rect(this.x, this.y, this.size, this.size); // replace with flickering powerup icons!
      // fill(0);
      // stroke(255);
      // ellipseMode(CORNER);
      // strokeWeight(5);
      // ellipse(this.x, this.y, this.size, this.size)
      // strokeWeight(3);
      // ellipse(this.x, this.y, this.size/1.5, this.size/1.5)
      // strokeWeight(2);
      // ellipse(this.x, this.y, this.size/2, this.size/2)
      // strokeWeight(1);
      // ellipse(this.x, this.y, this.size/3, this.size/3)
      // //text("Sz",this.x,this.y+(this.size-3));

      image(sizeIcon,this.x,this.y,this.size, this.size); // use powerup icon

    }else if(this.type == 'ghost'){
      stroke(255);
      strokeWeight(4);
      strokeJoin(ROUND);
      fill(0);
      text("G",this.x,this.y+(this.size-5));

//      image(ghostIcon,this.x,this.y,this.size, this.size);

    }else if(this.type == 'freeze'){
      // stroke(12,181,247);
      // strokeWeight(6);
      // strokeJoin(ROUND);
      // fill(0);
      // rect(this.x, this.y, this.size, this.size); 

      image(freezeIcon,this.x,this.y,this.size*1.5, this.size*1.5);

    }else if( this.type == 'psyMode'){
      fill(random(255),random(255),random(255));
      rect(this.x, this.y, this.size, this.size);
      fill(255);
      text("P",this.x,this.y+(this.size-3));
    }else if(this.type == 'length'){
      stroke(255,255,0);
      strokeWeight(4);
      text("L",this.x,this.y+(this.size-5));
    }else if(this.type == 'star'){

      // strokeWeight(0);
      // fill(random(255),random(255),random(255));
      // // plain ol regular star.      
      // beginShape();
      // vertex(this.x + (this.size/6), (this.y + this.size));
      // vertex((this.x+(this.size/2)),this.y);
      // vertex((this.x+(this.size - this.size/6)), (this.y + this.size));
      // vertex(this.x, (this.y+(this.size/3)));
      // vertex((this.x+this.size), (this.y+(this.size/3)));
      // endShape(CLOSE);

      strokeWeight(0);
      fill(random(255),random(255),random(255));
      ellipse(this.x+(this.size/2), this.y+(this.size/2), this.size, this.size - round(this.size / 20)); // need slight offset because of size of donut icon
//      ellipse(this.x+(this.size/2), this.y+(this.size/2), this.size + round(this.size / 10), this.size + round(this.size / 10)) // with halo
      image(starIcon,this.x,this.y,this.size, this.size);

      // Mario Star of David instead?
      // var yoffset = round(this.size / 3); 
      // triangle(this.x + (this.size/2), this.y - yoffset, this.x, (this.y + this.size - yoffset), (this.x+this.size), (this.y+this.size-yoffset));
      // triangle(this.x, this.y, (this.x + this.size), this.y, this.x + (this.size/2), (this.y+this.size)); 


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

