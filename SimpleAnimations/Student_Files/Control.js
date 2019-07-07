var isDrag=false;		
var xMclik=0.0;			
var yMclik=0.0;   
var xMdragTot=0.0;	
var yMdragTot=0.0;
lastMouseDown = 0;
CLICK_TIME_GAP = 0.15;
//***********MOUSE CONTROLS*************



function myMouseDown(ev, gl, canvas) {

	var canvas = document.getElementById('webgl');
	lastMouseDown = Date.now();
//==============================================================================
// Called when user PRESSES down any mouse button;
// 									(Which button?    console.log('ev.button='+ev.button);   )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseDown(pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
//	console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);
	
	isDrag = true;											// set our mouse-dragging flag
	xMclik = x;													// record where mouse-dragging began
	yMclik = y;
};


function myMouseMove(ev, gl, canvas) {

	var canvas = document.getElementById('webgl');
//==============================================================================
// Called when user MOVES the mouse with a button already pressed down.
// 									(Which button?   console.log('ev.button='+ev.button);    )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

	if(isDrag==false) return;				// IGNORE all mouse-moves except 'dragging'

	// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
//	console.log('myMouseMove(CVV coords  ):  x, y=\t',x,',\t',y);

	// find how far we dragged the mouse:
	xMdragTot += (x - xMclik);					// Accumulate change-in-mouse-position,&
	yMdragTot += (y - yMclik);
	
	GlobalRotation.value = (GlobalRotation.value - 60*(x- xMclik))%360;
	xMclik = x;													// Make next drag-measurement from here.
	yMclik = y;
};

function myMouseUp(ev, gl, canvas) {

	var canvas = document.getElementById('webgl');
//==============================================================================
// Called when user RELEASES mouse button pressed previously.
// 									(Which button?   console.log('ev.button='+ev.button);    )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
	var yp = canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseUp  (pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - canvas.width/2)  / 		// move origin to center of canvas and
  						 (canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - canvas.height/2) /		//										 -1 <= y < +1.
							 (canvas.height/2);
	console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);
	
	isDrag = false;											// CLEAR our mouse-dragging flag, and
	// accumulate any final bit of mouse-dragging we did:
	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);
	console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);
	
	console.log(Date.now()-lastMouseDown);
	
	if(Date.now() - lastMouseDown <= CLICK_TIME_GAP*1000){
		if( x< -0.3 && y > 0.3){
			NEW_ARM_LENGTH = 2;
		}
		if( x > -0.3 && x < 0.3 && y > -0.3 && y < 0.3){
			NEW_ARM_LENGTH = 3;
		}
		if( x> 0.3 && y < -0.3){
			NEW_ARM_LENGTH = 4;
		}
		console.log("CLICK");
	}
};
//***********CONTROL FUNCTIONS**********

function angleSubmit(Angle){
	angle = parseInt(Angle, 10);
	globalRotationAngle = angle;
	console.log("Submitted: " + angle);
	main();
}

function SpinUp(){
	TOP_SPEED += 100;
	DrawAll();
}

function SpinDown(){
	TOP_SPEED -= 100;
	DrawAll();
}

function ResestRotation(){
	TOP_SPEED = 100;
	DrawAll();
}

function Raise(){
	if(UpperArmJointRotation.value < 100){
	UpperArmJointRotation.value +=10;
	}
	DrawAll();
}

function Lower(){
	if(UpperArmJointRotation.value > 0){
	UpperArmJointRotation.value -=10;
	}
	DrawAll();
}

function ToggleDebug(){
	if(debug == 1){debug = 0;}
	else{debug = 1;}
	DrawAll();
}

//********KEYBOARD CONTROLS***********

document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
          SpinDown();
    }
    else if (e.keyCode == '39') {     
		SpinUp();
    }
    else if (e.keyCode == '38') {
        Raise()
    }
    else if (e.keyCode == '40') {
       Lower();
    }
	else if(e.keyCode == '80'){
		pause();
	}
	else if(e.keyCode == '68'){
		ToggleDebug();
	}
	else if(e.keyCode == '82'){
		ResestRotation();
	}
}
