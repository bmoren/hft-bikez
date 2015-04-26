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
  // var rgb = color.split(',');

  // var r = rgb[1];
  // var g = rgb[2];
  // var b = rgb[3];

	var iR = 255 - r;
	var iG = 255 - g;
	var iB = 255 - b;

	return "rgb(" + iR + "," + iG + "," + iB + ")";

}


//human readable Miliseconds
function readableMS(ms){
   min = (ms/1000/60) << 0;
   sec = (ms/1000) % 60;

   	if( min <= 0){
   		 message = Math.round(sec) + " sec";
	} else{
		message = min + ' m ' + Math.round(sec) + " s" ;
	}

	return message;
}


var MortalKombat={characters:["Goro","Johnny Cage","Kano","Liu Kang","Raiden","Reptile","Scorpion","Shang Tsung","Sonya Blade","Sub-Zero","Baraka","Jade","Jax","Kintaro","Kitana","Kung Lao","Mileena","Noob Saibot","Shao Kahn","Smoke","Chameleon","Cyrax","Ermac","Kabal","Khameleon","Motaro","Nightwolf","Rain","Sektor","Sheeva","Sindel","Stryker","Fujin","Quan Chi","Kia","Jataaka","Sareena","Shinnok","Jarek","Kai","Meat","Reiko","Tanya","Blaze","Bo Rai Cho","Drahmin","Frost","Hsu Hao","Kenshi","Li Mei","Mokap","Moloch","Nitara","Ashrah","Dairou","Darrius","Havik","Hotaru","Kira","Kobra","Monster","Onaga","Shujinko","Daegon","Taven","Dark Kahn","Cyber Sub-Zero","Kratos","Skarlet","Belokk","Hornbuckle","Nimbus Terrafaux"],get:function(){var a=this.characters.length-1;return this.characters[Math.floor(Math.random()*a)]}};

function nodeToString ( node ) {
   var tmpNode = document.createElement( "div" );
   tmpNode.appendChild( node.cloneNode( true ) );
   var str = tmpNode.innerHTML;
   tmpNode = node = null; // prevent memory leaks in IE
   return str;
}










