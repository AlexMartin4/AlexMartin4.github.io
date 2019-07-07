ROTATE_SPEED_YAW = 45;
ROTATING_YAW = 0;
ROTATE_SPEED_PITCH = 25;
ROTATING_PITCH = 0;

MOVEMENT_SPEED = 20;
MOVING = 0;

STRAFE_SPEED = 8;
STRAFING = 0;

var isDrag=false;		// mouse-drag: true when user holds down mouse button
var xMclik=0.0;			// last mouse button-down position (in CVV coords)
var yMclik=0.0;   
var xMdragTot=0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var yMdragTot=0.0;  

//===================Mouse and Keyboard event-handling Callbacks================
//==============================================================================
function myMouseDown(ev) {
//==============================================================================
// Called when user PRESSES down any mouse button;
// 									(Which button?    console.log('ev.button='+ev.button);   )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									  // x==0 at canvas left edge
  var yp = g_canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseDown(pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - g_canvas.width/2)  / 		// move origin to center of canvas and
  						 (g_canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - g_canvas.height/2) /		//										 -1 <= y < +1.
							 (g_canvas.height/2);
//	console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);
	
	isDrag = true;											// set our mouse-dragging flag
	xMclik = x;													// record where mouse-dragging began
	yMclik = y;
};


function myMouseMove(ev) {

	if(isDrag==false) return;				// IGNORE all mouse-moves except 'dragging'

	// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									  // x==0 at canvas left edge
	var yp = g_canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - g_canvas.width/2)  / 		// move origin to center of canvas and
  						 (g_canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - g_canvas.height/2) /		//										 -1 <= y < +1.
							 (g_canvas.height/2);
//	console.log('myMouseMove(CVV coords  ):  x, y=\t',x,',\t',y);

	// find how far we dragged the mouse:
	xMdragTot += (x - xMclik);					// Accumulate change-in-mouse-position,&
	yMdragTot += (y - yMclik);
	xMclik = x;													// Make next drag-measurement from here.
	yMclik = y;
// (? why no 'document.getElementById() call here, as we did for myMouseDown()
// and myMouseUp()? Because the webpage doesn't get updated when we move the 
// mouse. Put the web-page updating command in the 'draw()' function instead)
};

function myMouseUp(ev) {
//==============================================================================
// Called when user RELEASES mouse button pressed previously.
// 									(Which button?   console.log('ev.button='+ev.button);    )
// 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
  var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
  var xp = ev.clientX - rect.left;									  // x==0 at canvas left edge
	var yp = g_canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
//  console.log('myMouseUp  (pixel coords): xp,yp=\t',xp,',\t',yp);
  
	// Convert to Canonical View Volume (CVV) coordinates too:
  var x = (xp - g_canvas.width/2)  / 		// move origin to center of canvas and
  						 (g_canvas.width/2);			// normalize canvas to -1 <= x < +1,
	var y = (yp - g_canvas.height/2) /		//										 -1 <= y < +1.
							 (g_canvas.height/2);
	console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);
	
	isDrag = false;											// CLEAR our mouse-dragging flag, and
	// accumulate any final bit of mouse-dragging we did:
	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);
	console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);
	// Put it on our webpage too...
};


function myKeyDown(ev) {

}

function myKeyUp(ev) {

}

function myKeyPress(ev) {

  // RESET our g_timeStep min/max recorder:
  g_timeStepMin = g_timeStep;
  g_timeStepMax = g_timeStep;
	myChar = String.fromCharCode(ev.keyCode);	//	convert code to character-string
	// Report EVERYTHING about this pressed key in the webpage 
	// in the <div> element with id='Result':r 
/*  document.getElementById('KeyResult').innerHTML = 
   			'char= ' 		 	+ myChar 			+ ', keyCode= '+ ev.keyCode 	+ 
   			', charCode= '+ ev.charCode + ', shift= '	 + ev.shiftKey 	+ 
   			', ctrl= '		+ ev.shiftKey + ', altKey= ' + ev.altKey 		+ 
   			', metaKey= '	+ ev.metaKey 	+ '<br>' ;
*/  			
  // update particle system state? bouncyBalls.runMode 0=reset; 1= pause; 2=step; 3=run
	switch(myChar) {
		case '0':	
			currentPartSys.runMode = 0;			// RESET!
			break;
		case '1':
			currentPartSys.runMode = 2;			// PAUSE!
			break;
		case '2':							      // RUN!
			currentPartSys.runMode = 3;
			break;
		case 'b':							// Toggle floor-bounce constraint type:
		case 'B':
			if(currentPartSys.bounceType==0) currentPartSys.bounceType = 1;
			else currentPartSys.bounceType = 0;
			break;
		case 'w':
		case 'W':
			MoveForward();
			break;
		case 's':
		case 'S':
			MoveBackward();
			break;
		case 'a':
		case 'A':
			StrafeLeft();
			break;
		case 'd':
		case 'D':
			StrafeRight();
			break;
		case 'q':
		case 'Q':
			Rotate_Yaw_CCW();
			break;
		case 'e':
		case 'E':
			Rotate_Yaw_CW();
			break;
		case 'r':	
		case 'R':	
			Rotate_Pitch_Up();
		break;
		case 'f':	
		case 'F':	
			Rotate_Pitch_Down();
		break;
		
		case 'T':  // HARD reset: position AND velocity.
		  tornado.runMode = 0;			// RESET!
			tornado.s1[PART_XPOS] =  0.0;	
			tornado.s1[PART_YPOS] =  0.0;	
			tornado.s1[PART_ZPOS] =  0.0;	
			tornado.s1[PART_XVEL] =  tornado.INIT_VEL;	
			tornado.s1[PART_YVEL] =  tornado.INIT_VEL; // initial velocity in meters/sec.
			tornado.s1[PART_ZVEL] =  0.0;
			break;
		case 't':		// 'refresh' -- boost velocity only; return to 'run'
		for(var i = 0; i < tornado.partCount * PART_MAXVAR; i+= PART_MAXVAR) {
		    tornado.runMode = 3;  // RUN!
		    var initVelX = 10*Math.random();
			var initVelY = 10*Math.random();
			if(tornado.s1[PART_XVEL + i] > 0.0) tornado.s1[PART_XVEL + i] +=       initVelX; 
			else tornado.s1[PART_XVEL + i] -=      initVelX;
			if(tornado.s1[PART_YVEL + i] > 0.0) tornado.s1[PART_YVEL + i] += initVelY; 
			else tornado.s1[PART_YVEL + i] -= initVelY;

		}
		break;	
		case 'o':
		case 'O':
			// switch to a different solver:
			currentPartSys.solvType++;
			if(currentPartSys.solvType > currentPartSys.maxSolve){
				currentPartSys.solvType = 0;
			}
			break;
		case ' ':			// space-bar: single-step
			bouncyBalls.runMode = 2;
			break;
		default:
			console.log('myKeyPress(): Ignored key: '+myChar);
			break;
	}
}


function onPlusButton() {
//==============================================================================
	bouncyBalls.INIT_VEL *= 1.2;		// increase
	console.log('Initial velocity: '+bouncyBalls.INIT_VEL);
}

function onMinusButton() {
//==============================================================================
	bouncyBalls.INIT_VEL /= 1.2;		// shrink
	console.log('Initial velocity: '+bouncyBalls.INIT_VEL);
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



function animateYaw(){
	if(elapsed< 1000){
		var Rotate = new Matrix4();
		
		Yaw = (Yaw + ROTATING_YAW *elapsed/1000*ROTATE_SPEED_YAW)%360;
		Rotate.rotate(Pitch, 0 , -1 ,0);
		LookAt = new Vector4([1,0,0,0]);
		LookAt = Rotate.multiplyVector4(LookAt);
		if(ROTATING_YAW != 0){
			//console.log("Yaw: " + Yaw);
		}
		//console.log(ROTATING + " Global Rotation: " + GlobalRotation.value);
		ROTATING_YAW = 0;
	}
	
}
function animatePitch(){
	if(elapsed< 1000){
		var factor = elapsed/1000*MOVEMENT_SPEED*ROTATING_PITCH;
		
		var Rotate = new Matrix4();
		if( (Pitch < 80  ||  ROTATING_PITCH <  0) && (ROTATING_PITCH > 0 || Pitch > -80)){
			Pitch +=  ROTATING_PITCH *elapsed/1000*ROTATE_SPEED_PITCH;
		}
		Rotate.setRotate(Yaw, 0, 0, 1);
		Rotate.rotate(Pitch, 0 , -1 ,0);
		LookAt = new Vector4([1,0,0,0]);
		LookAt = Rotate.multiplyVector4(LookAt);
		if(ROTATING_PITCH != 0){
			//console.log("Pitch: " + Pitch);
		}
		
		ROTATING_PITCH = 0;
	}
	
}

function animateCameraMovement(){
	if(elapsed < 1000){
		var factor = elapsed/1000*MOVEMENT_SPEED*MOVING;
		
		Center = new Vector4([Center.elements[0] + LookAt.elements[0]*factor,
					Center.elements[1] + LookAt.elements[1]*factor,
					Center.elements[2] + LookAt.elements[2]*factor,
					Center.elements[3] + LookAt.elements[3]*factor,]);
		MOVING = 0;
	}
}

function animateCameraStrafe(){
	if(elapsed < 1000){
		if(STRAFING != 0){
			
		}
		var factor = elapsed/1000*STRAFE_SPEED*STRAFING;
		
		var Rotate = new Matrix4();
		Rotate.setRotate(Yaw,0,0,1);
		Rotate.rotate(Pitch, 0 ,-1, 0);
		Rotate.rotate(90, 0, 0, 1);
		var Perp = new Vector4([1,0,0,0]);
		var Perp = Rotate.multiplyVector4(Perp);
		Center = new Vector4([Center.elements[0] + Perp.elements[0]*factor,
					Center.elements[1] + Perp.elements[1]*factor,
					Center.elements[2] + Perp.elements[2]*factor,
					Center.elements[3] + Perp.elements[3]*factor,]);
		STRAFING = 0;
	}
}


function AllAnimations(){
	
	animateYaw();
	animatePitch();
	animateCameraMovement();
	animateCameraStrafe();
	
}
function printControls() {
//==============================================================================
// Print current state of the particle system on the webpage:
	var recipTime = 1000.0 / g_timeStep;			// to report fractional seconds
	var recipMin  = 1000.0 / g_timeStepMin;
	var recipMax  = 1000.0 / g_timeStepMax; 
	var solvTypeTxt;
	switch(currentPartSys.solvType){
		case 0:
			solvTypeTxt = 'RK2 -- State Variable <br>';
			break;
		case 1:
			solvTypeTxt = 'RK1 -- Euler Solver <br>'; 
			break;
		case 2:
			solvTypeTxt = 'Velocity Verlet <br>'; 
			break;
		default:
			solvTypeTxt = 'Solver type not recognized';
	}
 						
	var bounceTypeTxt;	
	switch(currentPartSys.bounceType){
		case 0:
			bounceTypeTxt = 'Velocity Reverse(no rest)<br>';
			break;
		case 1:
			bounceTypeTxt = 'Impulsive (will rest)<br>';
			break;
		default:
			bounceTypeTxt = 'Bounce type not recognized';
	}	// convert bounce number to text
			
	var titleTxt;
	var flavorTxt;
	switch(currentPartSys){
		case fire:
			titleTxt = "Reeves Fire, " + currentPartSys.partCount + " particles";
			flavorTxt = "This effect is made out of recycled particles that age over time. Notice their tirangular shape!";
		break;
		case tornado:
			titleTxt = "Tornado force field, " + currentPartSys.partCount + " particles";
			flavorTxt = "This effect is made by applying a position dependent force field to the particles.";
			
		break;
		case boids:
			titleTxt = "Boids flocking, " + currentPartSys.partCount + " particles";
			flavorTxt = "This effect simulates flocking patterns. Notice the attractors (green) and repulsors (red) that appear periodically. Notice the cylindrical boundary";
		break;
		case cloth:
			titleTxt = "Cloth, " + currentPartSys.partCount + " particles";
			flavorTxt = "This effect is made with interconnected springs. The wind effect is a time affected (gaussian) force.";
		break;
		case bouncyBalls:
				titleTxt = "Particle Fountain, " + currentPartSys.partCount + " particles";
			flavorTxt = "This effect is made with reused particles. Notice the cylindrical boundary";
	
		break;
	}
	document.getElementById('KeyResult').innerHTML = 
			'<h3>' + titleTxt + '</h3>' +
			'<p>' + flavorTxt + '</p>' + 
   			'<b>Solver = </b>' + solvTypeTxt + 
   			'<b>Bounce = </b>' + bounceTypeTxt +
   			'<br><b>timeStep = </b> 1/' + recipTime.toFixed(3) + ' sec';

}


