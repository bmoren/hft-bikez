//
// Utils
//

function _collide(x, xW, y, yW,  sX, sXW, sY, sYW) {
  return sXW > x && sYW > y && xW > sX && yW > sY;
}

function hitTest(x,y,w, sX,sY,sW){
  return _collide(x, x+w, y, y+w,  sX, sX+sW, sY, sY+sW);
}

function textPopUp(message, c){
    //this needs to happen on all 3 screens
    noStroke();
    fill(c);
    textAlign(CENTER);
    textSize(width/15);
    text(message, width/2, height/2);
}

function uuid(){
    var d = new Date().getTime();
    var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return _uuid;
};

//this is for p5.js color method only
function inverseColor(c){
	return color(255-red(c), 255-green(c), 255-blue(c));
}

// this is for RGB css property
function inverseRGB(r,g,b){
	var iR = 255 - r;
	var iG = 255 - g;
	var iB = 255 - b;

	return iR + "," + iG + "," + iB;

}

//human readable Miliseconds
function readableMS(ms){
   min = (ms/1000/60) << 0,
   sec = (ms/1000) % 60;

   	if( min <= 0){
   		 message = Math.round(sec) + " seconds";
	}else if(min ==1){ 
		message = min + ' minute ' + Math.round(sec) + " seconds" ;
	} else{
		message = min + ' minutes ' + Math.round(sec) + " seconds" ;
	}

	return message;
}

