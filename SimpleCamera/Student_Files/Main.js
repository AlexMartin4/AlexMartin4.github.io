debug = 0;
identity = new Matrix4();
LookAt = new Vector4([1,0,0,0]);
Center = new Vector4();
Yaw = 0;
Pitch = 0;
vertexCounter = 0;
RobotRotation = {'value' : 0};
robotRadius = 25;


GlobalRotation = {'value' : 0};

function main() {
	gl = init();
	
	canvas = document.getElementById('webgl');
	
	canvas.onmousedown	=	function(ev){myMouseDown( ev, gl, canvas) }; 
	canvas.onmousemove = 	function(ev){myMouseMove( ev, gl, canvas) };				
	canvas.onmouseup = 		function(ev){myMouseUp(   ev, gl, canvas)};
	
	WipeVertices();
	vertexCounter = 0;

	//Append all vertices imported from Tetrahedron.js, Parallepiped.js, Pentagon.js
	tetraIndex = vertexCounter;
	vertexCounter+= AppendTetra();
	debugIndex = vertexCounter;
	vertexCounter+= AppendDebug();
	cubeIndex = vertexCounter;
	vertexCounter+= AppendPara(1,1,1);
	longIndex  = vertexCounter;
	vertexCounter+= AppendPara(0.5,1,2);
	pentaIndex = vertexCounter;
	vertexCounter += AppendPenta();
	
	var cylColor1 = new Vector4([1.0, 0.0, 1.0, 1.0]);
	var cylColor2 = new Vector4([0.0, 1.0, 1.0, 1.0]);
	
	cylinderIndex = vertexCounter;
	vertexCounter += AppendCylinder(0.5, 0.5, 1, cylColor1, cylColor2);
	
	var coneColor1 = new Vector4([0.004, 1, .435, 1.0]);
	var coneColor2 = new Vector4([0.004, .475, .435, 1.0]);
	
	coneIndex = vertexCounter;
	vertexCounter += AppendCylinder(0, 0.5, 1, coneColor1, coneColor2);
	
	var trunkColor1 = new Vector4([0.55, 0.27, 0.07, 1.0]);
	var trunkColor2 = new Vector4([0.24, 0.17, 0.12, 1.0]);
	
	trunkIndex = vertexCounter;
	vertexCounter += AppendCylinder(0.5, 0.5, 1, trunkColor1, trunkColor2);
	

	headIndex = vertexCounter;
	vertexCounter+= AppendHead();
	
	var donutBaseColor = new Vector4([0.24, 0.17, 0.12, 1.0]);
	var donutTopColor = new Vector4([1,0,1,1]);
	
	donutIndex = vertexCounter;
	vertexCounter+= AppendDonut(donutTopColor, donutBaseColor);

	gridIndex = vertexCounter;
	vertexCounter+= AppendGrid();

	
	console.log("Verteces in VBO " + vertexCounter);
  
  //gl.disable(gl.CULL_FACE); // SHOW BOTH SIDES of all triangles
  donutRotationMatrix = new Matrix4();
  donutRotationMatrix.setRotate(90,0,1,0);
  lastSavedDonutRotation = donutRotationMatrix;
  
  identity.setIdentity();
	//********* HIERARCHY *************//  
  //This matrix multiplies every object in the scene

  Center = new Vector4([0.0, 0.0, 5.0, 1.0]);
  FindRandomTreePlacements();
  DrawAll();
  AllAnimations();
}





function DrawAll(){
	
	ResizeCanvas();
	var modelMatrix = new Matrix4();
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	modelMatrix.setIdentity(); 
	//console.log("Window width = " + window.innerWidth + " Canvas: X: " + window.innerWidth/2 + " Y: " + window.innerWidth/2*4/5);
	gl.viewport(0,0,window.innerWidth/2,window.innerWidth/2*4/5);
	modelMatrix.perspective(35.0,   // FOVY: top-to-bottom vertical image angle, in degrees
							1.25,   // Image Aspect Ratio: camera lens width/height
							1.0,   // camera z-near distance (always positive; frustum begins at z = -znear)
							1000.0); // far plane
	
	
	helperDrawAll(modelMatrix);
	gl.viewport(window.innerWidth/2,0,window.innerWidth/2, window.innerWidth/2*4/5);
	modelMatrix = new Matrix4();
	modelMatrix.setOrtho(-10, 10, -8, 8, 1.0, 1000);
	
	helperDrawAll(modelMatrix);
}

function helperDrawAll(modelMatrix){
	
	//LookAt.printMe();
	modelMatrix.lookAt( Center.elements[0], Center.elements[1], Center.elements[2], 
                     Center.elements[0] + LookAt.elements[0], Center.elements[1] + LookAt.elements[1],Center.elements[2] + LookAt.elements[2], 
                     0.0,  0.0,  1.0);     // 'up' vector
	
	DrawDebug(modelMatrix);
		
		if(debug == 0){
			DrawGrid(modelMatrix, gridIndex);
		}
		for(var i = 0; i < TreePlacements.length; i++){
		pushMatrix(modelMatrix);
			modelMatrix.translate(TreePlacements[i].elements[0], TreePlacements[i].elements[1], TreePlacements[i].elements[2],); 
			DrawTree(modelMatrix);
			modelMatrix = popMatrix();
		}
		pushMatrix(modelMatrix)
			modelMatrix.scale(100,100,100);
			DrawDebug(modelMatrix);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.rotate(-RobotRotation.value, 0,0,1);
			modelMatrix.translate(robotRadius,0,0);
			DrawRobot(modelMatrix);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(30,-20,2);
			modelMatrix.scale(1.5,1.5,1.5);
			
			
			
			
			modelMatrix.concat(donutRotationMatrix);
			
			DrawDonut(donutIndex, modelMatrix);
			
		modelMatrix = popMatrix();
	
}

function ResizeCanvas(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerWidth*4/5*1/2;
}

