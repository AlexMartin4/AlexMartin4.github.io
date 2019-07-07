var gl;  
var g_canvas; 




//--Animation---------------
var isClear = 1;		  // 0 or 1 to enable or disable screen-clearing in the
    									// draw() function. 'C' or 'c' key toggles in myKeyPress().
var g_last = Date.now();				//  Timestamp
var g_stepCount = 0;						// Advances by 1 for each timestep, modulo 1000, 
																// (0,1,2,3,...997,998,999,0,1,2,..) to identify 
																// WHEN the ball bounces.  RESET by 'r' or 'R'.

var g_timeStep = 1000.0/60.0;			// current timestep (1/60th sec) in milliseconds
var g_timeStepMin = g_timeStep;   // min,max timestep values since last keypress.
var g_timeStepMax = g_timeStep;


// Create & initialize a 1-particle 'state variables' s0,s1;
//---------------------------------------------------------
var bouncyBalls = new PartSys();
tornado = new PartSys();  
cloth = new PartSys();  
fire = new PartSys();  
boids = new PartSys();
var grid;

var MVPMatrix = new Matrix4();

LookAt = new Vector4([1,0,0,0]);
Center = new Vector4();
Up =  new Vector4();
Yaw = 0;
Pitch = 0;


currentPartSys = cloth;

function main() {
//==============================================================================
	g_canvas = document.getElementById('webgl');
	gl = g_canvas.getContext("webgl", { preserveDrawingBuffer: true});
	
	if (!gl) {
		console.log('main() Failed to get the rendering context for WebGL');
	return;}

	g_canvas.onmousedown	=	function(ev){myMouseDown(ev) }; 
	g_canvas.onmousemove = 	function(ev){myMouseMove(ev) };				
	g_canvas.onmouseup = 		function(ev){myMouseUp(  ev) };
  					
	window.addEventListener("keydown", myKeyDown, false);
	window.addEventListener("keyup", myKeyUp, false);
	window.addEventListener("keypress", myKeyPress, false);
  
	//gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.75, 0.75, 0.75, 1);	 // RGBA color for clearing WebGL framebuffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);		// clear it once to set that color as bkgnd.
	
	grid = newGrid();
	grid.init();
	
	bouncyBalls.initBouncy(3000);    
	
	tornado.initTornado(5000);
	
	cloth.initCloth(60, 12);
	
	fire.initFire(20000);
	
	boids.initBoids(90, 2);
	
	printControls();
	

	
	Center = new Vector4([-3.0, 0.0, 3.0, 1.0]);
	LookAt = new Vector4([1,0,-1,0]);
	Up = new Vector4([0,0,1,0]);
	
 
	var tick = function() {
		g_timeStep = animate(); 
		if (g_timeStep > 2000) {   
			g_timeStep = 1000/60;
        }
		if (g_timeStep < g_timeStepMin) g_timeStepMin = g_timeStep;  
		else if(g_timeStep > g_timeStepMax) g_timeStepMax = g_timeStep;
		

		draw();    
		AllAnimations();
		requestAnimationFrame(tick, g_canvas);
	};
	
  tick();
}

function animate() {
//==============================================================================  
// Returns how much time (in milliseconds) passed since the last call to this fcn.
  var now = Date.now();	        
  elapsed = now - g_last;	// amount of time passed, in integer milliseconds
  g_last = now;               // re-set our stopwatch/timer.

  // INSTRUMENTATION:  (delete if you don't need to know the range of time-steps)
  g_stepCount = (g_stepCount +1)%1000;		// count 0,1,2,...999,0,1,2,...

  //-----------------------end instrumentation
  return elapsed;
}


function updateParticles(){
	if(isClear == 1) gl.clear(gl.COLOR_BUFFER_BIT);

	
// TODO: change to a loop
  /*if(bouncyBalls.runMode > 1) {								// 0=reset; 1= pause; 2=step; 3=run
		if(bouncyBalls.runMode == 2) bouncyBalls.runMode=1;			// (if 2, do just one step and pause.)

		bouncyBalls.solver();         // find s1 from  s0 & related states.
		bouncyBalls.applyConstraints();  // Apply constraints
	}*/
	
  if(tornado.runMode > 1){
		if(tornado.runMode == 2) tornado.runMode = 1;
		tornado.solver();
		tornado.applyConstraints();
	}
	
	if(cloth.runMode > 1){
		if(cloth.runMode == 2) cloth.runMode = 1;
		cloth.solver();
		cloth.applyConstraints();
	}
	
	if(fire.runMode > 1){
		if(fire.runMode == 2) fire.runMode = 1;
		fire.solver();
		fire.applyConstraints();
	}
	
	if(boids.runMode > 1){
		if(boids.runMode == 2) boids.runMode = 1;
		boids.solver();
		boids.applyConstraints();
	}
}
function draw() {
//============================================================================== 
	
	
	
	updateParticles();

	var mvp = new Matrix4();
	mvp.setPerspective(60.0,  16/9, 1.0, 1000.0); 
	
	

	mvp.lookAt( 
				Center.elements[0], Center.elements[1], Center.elements[2], 
                Center.elements[0] + LookAt.elements[0], Center.elements[1] + LookAt.elements[1],Center.elements[2] + LookAt.elements[2], 
                Up.elements[0], Up.elements[1], Up.elements[2]);     // 'up' vector
	
	
	var modelMatrix = new Matrix4();
	
	printControls();				// Display particle-system status on-screen. 
	
	tempEye = new Vector3([Center.elements[0], Center.elements[1], Center.elements[2]]);
	grid.adjust(modelMatrix, mvp);
	grid.draw();
	
	//THIS DRAWING SCHEME IS SUBOPTIMAL TO SAY THE LEAST
	//I couldn't figure out how to make the Depth buffer work properly --> TODO for the future
	//Draw the furthest Part Sys
	
	if(currentPartSys == fire){
		pushMatrix(modelMatrix);
			modelMatrix.translate(10, 10, 0);
			
			tornado.render(modelMatrix, mvp, tempEye);     // transfer current state to VBO, set uniforms, draw it!
		
		modelMatrix = popMatrix();
	}
	if(currentPartSys == boids){
		pushMatrix(modelMatrix);
			modelMatrix.translate(-10, 10, 0);
			//modelMatrix.translate(3, 0, 0);
			modelMatrix.rotate(90, 0, 0, 1);
			
			cloth.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	if(currentPartSys == tornado){
		pushMatrix(modelMatrix);
			modelMatrix.translate(-10, -10, 0);
			
			fire.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	if(currentPartSys == cloth){
		pushMatrix(modelMatrix);
			modelMatrix.translate(10, -10, 0);
			//modelMatrix.translate(3, 0, 0);

			boids.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	
	//bouncyBalls.render(modelMatrix, mvp, tempEye);
	
	
	//Draw the next 2 part sysses
	
	if(currentPartSys != tornado && currentPartSys != fire){
		pushMatrix(modelMatrix);
			modelMatrix.translate(10, 10, 0);
			
			tornado.render(modelMatrix, mvp, tempEye);     // transfer current state to VBO, set uniforms, draw it!
		modelMatrix = popMatrix();
	}
	if(currentPartSys != cloth && currentPartSys != boids){
		pushMatrix(modelMatrix);
			modelMatrix.translate(-10, 10, 0);
			//modelMatrix.translate(3, 0, 0);
			modelMatrix.rotate(90, 0, 0, 1);
			
			cloth.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	if(currentPartSys != fire && currentPartSys != tornado){
		pushMatrix(modelMatrix);
			modelMatrix.translate(-10, -10, 0);
			
			fire.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	if(currentPartSys != boids && currentPartSys != cloth){
		pushMatrix(modelMatrix);
			modelMatrix.translate(10, -10, 0);
			//modelMatrix.translate(3, 0, 0);

			boids.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	//Draw the nearest partsys
	
	if(currentPartSys == tornado){
		pushMatrix(modelMatrix);
			modelMatrix.translate(10, 10, 0);
			
			tornado.render(modelMatrix, mvp, tempEye);     // transfer current state to VBO, set uniforms, draw it!
		
		modelMatrix = popMatrix();
	}
	if(currentPartSys == cloth){
		pushMatrix(modelMatrix);
			modelMatrix.translate(-10, 10, 0);
			modelMatrix.rotate(90, 0, 0, 1);
			
			cloth.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	if(currentPartSys == fire){
		pushMatrix(modelMatrix);
			modelMatrix.translate(-10, -10, 0);
			
			fire.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	if(currentPartSys == boids){
		pushMatrix(modelMatrix);
			modelMatrix.translate(10, -10, 0);

			boids.render(modelMatrix, mvp, tempEye);    
		
		modelMatrix = popMatrix();
	}
	
	ChooseNewSection();
	
}

function ChooseNewSection(){
	

	if(tempEye.elements[0] > 0 && tempEye.elements[1] > 0){
		
		currentPartSys = tornado;
	}
	if(tempEye.elements[0] > 0 && tempEye.elements[1] < 0){
		
		currentPartSys = boids;
	}
	if(tempEye.elements[0] < 0 && tempEye.elements[1] > 0){
		
		currentPartSys = cloth;
	}
	if(tempEye.elements[0] < 0 && tempEye.elements[1] < 0){
		
		currentPartSys = fire;
	}
	/*console.log(Math.pow(tempEye.elements[0],2) + Math.pow(tempEye.elements[1],2));
	if(Math.pow(tempEye.elements[0],2) + Math.pow(tempEye.elements[1],2) < 75){
		currentPartSys = bouncyBalls;
	}*/
}