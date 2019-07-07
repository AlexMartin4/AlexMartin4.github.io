debug = 0;
identity = new Matrix4();
LookAt = new Vector4([1,0,0,0]);
Center = new Vector4();
Yaw = 0;
Pitch = 0;
vertexCounter = 0;
RobotRotation = {'value' : 0};
robotRadius = 25.0;

var lamp0Pos;
var lamp1Pos;
var currentMat;


GlobalRotation = {'value' : 0};

DonutMat = 6;

function main() {
	gl = init();
	
	canvas = document.getElementById('webgl');
	
	canvas.onmousedown	=	function(ev){myMouseDown( ev, gl, canvas) }; 
	canvas.onmousemove = 	function(ev){myMouseMove( ev, gl, canvas) };				
	canvas.onmouseup = 		function(ev){myMouseUp(   ev, gl, canvas)};
	
	WipeVertices();
	vertexCounter = 0;

	//Append all vertices imported from Tetrahedron.js, Parallepiped.js, Pentagon.js
	var sphereColor = new Vector4([1.0,0.0, 0.0, 1.0]);
	sphereIndex = vertexCounter;
	vertexCounter+= AppendSphere(sphereColor);
	
	gridIndex = vertexCounter;
	vertexCounter+= AppendGrid();
	debugIndex = vertexCounter;
	vertexCounter+= AppendDebug();
	cubeIndex = vertexCounter;
	vertexCounter+= AppendPara(1,1,1);
	longIndex  = vertexCounter;
	vertexCounter+= AppendPara(0.5,1,2);
	

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



	
	console.log("Verteces in VBO " + vertexCounter);
  
  //gl.disable(gl.CULL_FACE); // SHOW BOTH SIDES of all triangles
  donutRotationMatrix = new Matrix4();
  donutRotationMatrix.setRotate(90,0,1,0);
  lastSavedDonutRotation = donutRotationMatrix;
  
  identity.setIdentity();
	//********* HIERARCHY *************//  
  //This matrix multiplies every object in the scene
  
  qa = new Quaternion(4,3,4,-2);
  qb = new Quaternion(0,0,3, 4);
  qc = new Quaternion(0,0,0,0);
  qc.multiply(qa,qb);
  qc.normalize();
  qc.printMe();
  

  Center = new Vector4([0.0, 0.0, 5.0, 1.0]);
  LookAt = new Vector4([1,0,0,0]);
  Up = new Vector4([0,0,1,0]);
  InitializeLights();
  FindRandomTreePlacements();
  DrawAll();
  AllAnimations();
}





function DrawAll(){
	
	ResizeCanvas();
	var modelMatrix = new Matrix4();
	var normalMatrix = new Matrix4();
	var mvpMatrix = new Matrix4();
	
	
	updateMaterial(MATL_GRN_PLASTIC);
	
	updateLighting(isPhong);
	updateShading(isGouraud);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	
	//console.log("Window width = " + window.innerWidth + " Canvas: X: " + window.innerWidth/2 + " Y: " + window.innerWidth/2*4/5);
	gl.viewport(0,0,window.innerWidth,window.innerWidth*2.5/5);
	mvpMatrix.perspective(35.0,   // FOVY: top-to-bottom vertical image angle, in degrees
							2,   // Image Aspect Ratio: camera lens width/height
							1.0,   // camera z-near distance (always positive; frustum begins at z = -znear)
							1000.0); // far plane*/
	
	
	helperDrawAll(modelMatrix, mvpMatrix, normalMatrix);

}

function helperDrawAll(modelMatrix, mvpMatrix, normalMatrix){
	

	mvpMatrix.lookAt(Center.elements[0], Center.elements[1], Center.elements[2], 
                     Center.elements[0] + LookAt.elements[0], Center.elements[1] + LookAt.elements[1],Center.elements[2] + LookAt.elements[2], 
                     Up.elements[0], Up.elements[1], Up.elements[2]);     // 'up' vector*/
	
	updateMvpMatrix(mvpMatrix);
	updateEyePoint(Center);
	lamp[0].I_pos = Center;
	updateLightsT(0);
	
	DrawDebug(modelMatrix);
	
	
		
		if(debug == 0){
			DrawGrid(modelMatrix, gridIndex, MATL_GRN_PLASTIC, MATL_BLU_PLASTIC);
			pushMatrix(modelMatrix);
				modelMatrix.translate(0.0,0.0, 5.0);
				modelMatrix.scale(4.0, 4.0, 4.0)
				modelMatrix.rotate(2*RobotRotation.value, 0,0,1);
				DrawSphere(modelMatrix, sphereIndex, MATL_CHROME);
			modelMatrix = popMatrix();
		}
		for(var i = 0; i < TreePlacements.length; i++){
			pushMatrix(modelMatrix);
				//DrawTree(modelMatrix);
			modelMatrix = popMatrix();
		}
		pushMatrix(modelMatrix);
			modelMatrix.rotate(-RobotRotation.value, 0,0,1);
			modelMatrix.translate(robotRadius,0,0);
			DrawRobot(modelMatrix);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(15,0,3);
			modelMatrix.scale(1.5,1.5,1.5);
			
			
			modelMatrix.concat(donutRotationMatrix);
			modelMatrix.scale(1.0,1.0,1.0);
			DrawDonut(donutIndex, modelMatrix, DonutMat);
			
		modelMatrix = popMatrix();
}

function ResizeCanvas(){
	canvas.width = window.innerWidth*0.75;
	canvas.height = window.innerWidth*2.5/5*0.75;
}


function InitializeLights(){
	
	var modelMatrix = new Matrix4();
	var normalMatrix = new Matrix4();
	var mvpMatrix = new Matrix4();
	
	var LightPos0 = new Vector4([0.0, 0.0, 5.0, 1.0]);
	var LightColor0 = new Vector4([0.9, 0.9, 0.9, 1.0]);
	var AmbientColor0 = new Vector4([0.2, 0.2, 0.2, 1.0]);
	var SpecularColor0 = new Vector4([0.3, 0.3, 0.3, 1.0]);
	
	
	lamp[0].I_pos = LightPos0;
	lamp[0].I_diff = LightColor0;
	lamp[0].I_ambi = AmbientColor0;
	lamp[0].I_spec = SpecularColor0;
	lamp[0].isLit = true;
	
	updateLightsT(0);
	
	var modelMatrix = new Matrix4();
	var normalMatrix = new Matrix4();
	var mvpMatrix = new Matrix4();
	
	var LightPos1 = new Vector4([25.0, 0.0, 5.0, 1.0]);
	var LightColor1 = new Vector4([0.9, 0.9, 0.9, 1.0]);
	var AmbientColor1 = new Vector4([0.2, 0.2, 0.2, 1.0]);
	var SpecularColor1 = new Vector4([0.3, 0.3, 0.3, 1.0]);
	
	
	lamp[1].I_pos = LightPos1;
	lamp[1].I_diff = LightColor1;
	lamp[1].I_ambi = AmbientColor1;
	lamp[1].I_spec = SpecularColor1;
	lamp[1].isLit = true;
	
	updateLightsT(1);
}