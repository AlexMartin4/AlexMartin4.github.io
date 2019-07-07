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
	
	var Rotate = new Matrix4();
	Rotate.setRotate(Yaw,0,0,1);
	Rotate.rotate(Pitch, 0 ,-1, 0);
	Rotate.rotate(90, 0, 0, 1);
	var y_vect = new Vector4([1,0,0,0]);
	y_vect = Rotate.multiplyVector4(y_vect);
	
	Rotate.setRotate(Yaw,0,0,1);
	Rotate.rotate(Pitch, 0 ,-1, 0);
	Rotate.rotate(-90, 0, 1, 0);
	var z_vect = new Vector4([1,0,0,0]);
	z_vect = Rotate.multiplyVector4(z_vect);
	
	//console.log(xMdragTot*60 + " rotation");
	//console.log("Z: " + z.elements[0] + " "+ z.elements[1] + " "+ z.elements[2]);
	//console.log("Y: " + y.elements[0] + " "+ y.elements[1] + " "+ y.elements[2]);
	//Floating point error makes this v
	
	
	
	
	var temp = new Matrix4();
	console.log(xMdragTot*60 + " rotation");
	temp.setRotate(xMdragTot*60,  z_vect.elements[0], z_vect.elements[1], z_vect.elements[2],);
	temp.rotate(yMdragTot*60, y_vect.elements[0], y_vect.elements[1], y_vect.elements[2],);
	donutRotationMatrix = temp.concat(lastSavedDonutRotation);
	
	
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
	
	isDrag = false;											// CLEAR our mouse-dragging flag, and
	// accumulate any final bit of mouse-dragging we did:
	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);
	
	console.log(Date.now()-lastMouseDown);
	
	console.log("SAVED");
	lastSavedDonutRotation = donutRotationMatrix;
	
	xMdragTot = 0;
	yMdragTot = 0;
};
//***********CONTROL FUNCTIONS**********

function angleSubmit(Angle){
	angle = parseInt(Angle, 10);
	globalRotationAngle = angle;
	console.log("Submitted: " + angle);
	main();
}

function Rotate_Yaw_CCW(){
	ROTATING_YAW = 1;
}

function Rotate_Yaw_CW(){
	ROTATING_YAW = -1;
}
function Rotate_Pitch_Up(){
	ROTATING_PITCH = 1;
}

function Rotate_Pitch_Down(){
	ROTATING_PITCH = -1;
}

function ResestRotation(){
	TOP_SPEED = 100;
	DrawAll();
}

function MoveForward(){
	MOVING = 1;
}

function MoveBackward(){
	MOVING = -1;
}

function StrafeLeft(){
	STRAFING = 1;
}

function StrafeRight(){
	STRAFING  = -1;
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
function TogglePerspective(){
	if(perspective == 1){perspective = 0;}
	else{perspective = 1;}
	DrawAll();
}

//********KEYBOARD CONTROLS***********

document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37' || e.keyCode == '81') {
          Rotate_Yaw_CCW();
    }
   
    if (e.keyCode == '39' || e.keyCode == '69') {     
		 Rotate_Yaw_CW();
    }
	
	 if (e.keyCode == '82') {     
		 Rotate_Pitch_Up();
    }
    if (e.keyCode == '70') {
          Rotate_Pitch_Down();
		  
    }
    if (e.keyCode == '38' || e.keyCode == '87') {
        MoveForward();
    }
    if (e.keyCode == '40' || e.keyCode == '83') {
       MoveBackward();
    }
	if (e.keyCode == '80') {
        Raise()
    }
    if (e.keyCode == '79') {
       Lower();
    }
	
	if (e.keyCode == '65') {
        StrafeLeft();
    }
    if (e.keyCode == '68') {
       StrafeRight();
    }
	if (e.keyCode == '71') {
       TogglePerspective();
    }
	
	if(e.keyCode == '32'){
		pause();
	}
	if(e.keyCode == '84'){
		ToggleDebug();
	}

}
