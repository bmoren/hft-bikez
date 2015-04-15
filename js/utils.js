//
// Utils
//

function _collide(x, xW, y, yW,  sX, sXW, sY, sYW) {
  return sXW > x && sYW > y && xW > sX && yW > sY;
}

function hitTest(x,y,w, sX,sY,sW){
  return _collide(x, x+w, y, y+w,  sX, sX+sW, sY, sY+sW);
}

function textPopUp(message, color){
    //this needs to happen on all 3 screens
    noStroke();
    fill(color);
    textAlign(CENTER);
    textSize(width/15);
    text(message, width/2, height/2);
}

function inverseColor(c){
	return color(255-red(c), 255-green(c), 255-blue(c));
}
