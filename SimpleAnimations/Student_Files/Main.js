triangleSeparationAngle = 55.2;
separationDistance = 0.33;
debug = 0;
identity = new Matrix4();
vertexCounter = 0;

GlobalRotation = {'value' : 0};

FingerRotation = {'value' : 0};
FingerRotationIndex = {'value' : 0};
LowerFingerRotation = {'value' : 0};
LowerFingerRotationIndex = {'value' : 0};

WristRotationX = {'value' : 90}; //Palm up v Palm down
WristRotationY = {'value' : 0}; //Up/Down
WristRotationZ = {'value' : 0};  //Side to Side

TopRotation = {'value': 0};

UpperArmJointRotation = {'value' : 0};
UpperArmLength = {'value': 3};



function main() {
	gl = init();
	
	canvas = document.getElementById('webgl');
	
	canvas.onmousedown	=	function(ev){myMouseDown( ev, gl, canvas) }; 
	canvas.onmousemove = 	function(ev){myMouseMove( ev, gl, canvas) };				
	canvas.onmouseup = 		function(ev){myMouseUp(   ev, gl, canvas)};
	
	WipeVertices();
	vertexCounter = 0;

	//Append all vertices imported from Tetrahedron.js, Parallepiped.js, Pentagon.js
	vertexCounter+= AppendTetraAndDebug();
	cubeIndex = vertexCounter;
	vertexCounter+= AppendPara(1,1,1);
	longIndex  = vertexCounter;
	vertexCounter+= AppendPara(0.5,1,2);
	pentaIndex = vertexCounter;
	vertexCounter += AppendPenta();
	cylinderIndex = vertexCounter;
	vertexCounter += AppendCylinder();
	topIndex = vertexCounter;
	vertexCounter += AppendTop();

	console.log(vertexCounter);
  
  //gl.disable(gl.CULL_FACE); // SHOW BOTH SIDES of all triangles
  
  identity.setIdentity();
  GlobalTransform = new Transform();
  GlobalTransform.matrix.scale(0.25,0.25,0.25);
	//********* HIERARCHY *************//  
  //This matrix multiplies every object in the scene
  DrawAll();
  AllAnimations();
}


function DrawArm(Parent){
	
	var UpperArmTransform = new Transform();
	UpperArmTransform.matrix.translate(-3,2,0);
	UpperArmTransform.matrix.rotate(-45,0,0,1);
	UpperArmTransform.matrix.scale(UpperArmLength.value,1,1);
	UpperArmTransform.matrix.translate(0.5,0,0);
		
		var UpperArmJointTransfrom = new Transform();
		UpperArmTransform.addChild(UpperArmJointTransfrom);
		UpperArmJointTransfrom.matrix.translate(0.45,0,0);
		UpperArmJointTransfrom.matrix.scale(1/UpperArmLength.value,1,1);
		UpperArmJointTransfrom.matrix.rotate(UpperArmJointRotation.value,0,0,1);
			
			var LowerArmTransform = new Transform();
			UpperArmJointTransfrom.addChild(LowerArmTransform);
			LowerArmTransform.matrix.translate(1.12,0,0);
			LowerArmTransform.matrix.rotate(-90,0,1,0);
			
				var LowerArmJointTransform = new Transform();
				LowerArmTransform.addChild(LowerArmJointTransform);
				LowerArmJointTransform.matrix.rotate(90,0,1,0);
				LowerArmJointTransform.matrix.rotate(180,1,0,0);
				LowerArmJointTransform.matrix.translate(1,0,0);
				//console.log(WristRotationX.value +", " + WristRotationY.value + ", " + WristRotationZ.value);
				LowerArmJointTransform.matrix.rotate(WristRotationX.value, 1, 0 ,0);
				LowerArmJointTransform.matrix.rotate(WristRotationY.value, 0, 1 ,0);
				LowerArmJointTransform.matrix.rotate(WristRotationZ.value, 0, 0 ,1);
				
					var PalmTransform = new Transform();
					LowerArmJointTransform.addChild(PalmTransform);
					PalmTransform.matrix.scale(0.75,0.75,0.75);
					PalmTransform.matrix.translate(1,0,0);
					PalmTransform.matrix.rotate(90,0,1,0);
					PalmTransform.matrix.rotate(50,1,0,0);
							
							//Little Finger
							var Finger1JointTransform = new Transform();
							PalmTransform.addChild(Finger1JointTransform);
							Finger1JointTransform.matrix.translate(0,1,0);
							Finger1JointTransform.matrix.rotate(-36,1,0,0);
							Finger1JointTransform.matrix.rotate(-90,0,1,0);
							Finger1JointTransform.matrix.rotate(20,0,0,1);
							Finger1JointTransform.matrix.translate(-0.2,0.05,0);
							Finger1JointTransform.matrix.rotate(FingerRotation.value,0,1,0);
							Finger1JointTransform.matrix.scale(0.4,0.375,0.5);
							
							
							//Ring Finger
							var Finger2JointTransform = new Transform();
							PalmTransform.addChild(Finger2JointTransform);
							Finger2JointTransform.matrix.translate(0,1,0);
							Finger2JointTransform.matrix.rotate(-36,1,0,0);
							Finger2JointTransform.matrix.rotate(-90,0,1,0);
							Finger2JointTransform.matrix.rotate(20,0,0,1);
							Finger2JointTransform.matrix.translate(-0.2,-0.45,0);
							Finger2JointTransform.matrix.rotate(FingerRotation.value,0,1,0);
							Finger2JointTransform.matrix.scale(0.5,0.5,0.5);
							
							//Middle Finger
							var Finger3JointTransform = new Transform();
							PalmTransform.addChild(Finger3JointTransform);
							Finger3JointTransform.matrix.translate(0,1,0);
							Finger3JointTransform.matrix.rotate(-36,1,0,0);
							Finger3JointTransform.matrix.rotate(-90,0,1,0);
							Finger3JointTransform.matrix.rotate(20,0,0,1);
							Finger3JointTransform.matrix.translate(-0.2,-0.95,0);
							Finger3JointTransform.matrix.rotate(FingerRotation.value,0,1,0);
							Finger3JointTransform.matrix.scale(0.55,0.5,0.5);
							
							
							//Index Finger
							var Finger4JointTransform = new Transform();
							PalmTransform.addChild(Finger4JointTransform);
							Finger4JointTransform.matrix.translate(0,1,0);
							Finger4JointTransform.matrix.rotate(-36,1,0,0);
							Finger4JointTransform.matrix.rotate(-90,0,1,0);
							Finger4JointTransform.matrix.rotate(20,0,0,1);
							Finger4JointTransform.matrix.translate(-0.5,-1.4,0);
							Finger4JointTransform.matrix.rotate(FingerRotationIndex.value,0,1,0);
							Finger4JointTransform.matrix.scale(0.5,0.45,0.5);
							
							var ThumbJointTransform = new Transform();
							PalmTransform.addChild(ThumbJointTransform);
							ThumbJointTransform.matrix.translate(0,-0.8,0);
							ThumbJointTransform.matrix.rotate(-50,1,0,0);
							ThumbJointTransform.matrix.rotate(-90,0,1,0);
							ThumbJointTransform.matrix.rotate(-50,0,0,1);
							ThumbJointTransform.matrix.scale(0.5,0.5,0.5);
	
	
  UpperArmTransform.propagateTransforms(Parent.matrix);
  
//*********** HIERARCHY END ************//
	
  //*********** MODELING *************//
 
  

  DrawCylinder(UpperArmTransform, cylinderIndex);
  DrawDebug(UpperArmJointTransfrom);
  DrawPara(LowerArmTransform, longIndex);
  DrawDebug(LowerArmJointTransform);
  DrawPenta(PalmTransform, pentaIndex);
  DrawFinger(Finger1JointTransform,LowerFingerRotation.value);
  DrawFinger(Finger2JointTransform,LowerFingerRotation.value);
  DrawFinger(Finger3JointTransform,LowerFingerRotation.value);
  DrawFinger(Finger4JointTransform,LowerFingerRotationIndex.value);
  DrawFinger(ThumbJointTransform,0);
}
function DrawTopStack(Parent){
	
	var BottomTransform = new Transform();
	BottomTransform.matrix.translate(-3,-2,2);
	BottomTransform.matrix.scale(0.75,0.75,0.75);
	BottomTransform.matrix.rotate(TopRotation.value, 0 ,1, 0);
		var MiddleTransform = new Transform();
		BottomTransform.addChild(MiddleTransform);
		MiddleTransform.matrix.translate(0,2,0);
		MiddleTransform.matrix.rotate(-2*TopRotation.value, 0 ,1, 0);
			var TopTransform = new Transform();
			MiddleTransform.addChild(TopTransform);
			TopTransform.matrix.translate(0,2,0);
			TopTransform.matrix.rotate(2*TopRotation.value, 0 ,1, 0);
			
	BottomTransform.propagateTransforms(Parent.matrix);
	
	DrawTop(BottomTransform, topIndex);
	DrawTop(MiddleTransform, topIndex);
	DrawTop(TopTransform, topIndex);
}

function DrawAll(){
	GlobalTransform.matrix.setRotate(GlobalRotation.value,0,1,0);
	GlobalTransform.matrix.scale(0.25,0.25,0.25);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	DrawArm(GlobalTransform);
	DrawTopStack(GlobalTransform);
}

function DrawFinger(Parent, rotation){
	
	var UpperFingerTransform = new Transform();
	UpperFingerTransform.matrix.scale(1.5,0.75,0.75);
	UpperFingerTransform.matrix.translate(0.5,0,0);
		
		var UpperFingerJointTransfrom = new Transform();
		UpperFingerTransform.addChild(UpperFingerJointTransfrom);
		UpperFingerJointTransfrom.matrix.translate(0.5,0,0);
		UpperFingerJointTransfrom.matrix.scale(0.5,1,1);
		UpperFingerJointTransfrom.matrix.rotate(rotation,0,1,0);
			
			var LowerFingerTransform = new Transform();
				UpperFingerJointTransfrom.addChild(LowerFingerTransform);
				LowerFingerTransform.matrix.translate(1.1,0,0);
				LowerFingerTransform.matrix.scale(0.8,1,1);
				LowerFingerTransform.matrix.rotate(-90,0,1,0);
				

	UpperFingerTransform.propagateTransforms(Parent.matrix);
	
	DrawPara(UpperFingerTransform,cubeIndex);
	DrawDebug(UpperFingerJointTransfrom);
	DrawPara(LowerFingerTransform, longIndex);

}