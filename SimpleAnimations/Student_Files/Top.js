

function AppendTop() {
  
   TopCounterCap = 0;
   TopCounterHandle = 0;
   TopCounterTop = 0;
   TopCounterMid = 0;
   TopCounterBot = 0;
   
   Vector0 = new Vector4([0,-1,0,1]);
   Vector1 = new Vector4([0.75,0,0,1]);
   Vector2 = new Vector4([0.75,0.5,0,1]);
   Vector3 = new Vector4([0.25,0.75,0,1]);
   Vector5 = new Vector4([0.25,1,0,1]);
   Vector6 = new Vector4([0,1,0,1]);
   
   Rotation = new Matrix4();
   Rotation.setIdentity();
   Rotation.rotate(-60,0,1,0);
   
	BottomTriangle(1,0,0,1);
	BottomTriangle(1,1,0,1);
	BottomTriangle(0,1,0,1);
	BottomTriangle(0,1,1,1);
	BottomTriangle(0,0,1,1);
	BottomTriangle(1,0,1,1);
	
	MiddileSquares(1,1,0,1);
	MiddileSquares(0,1,0,1);
	MiddileSquares(0,1,1,1);
	MiddileSquares(0,0,1,1);
	MiddileSquares(1,0,1,1);
	MiddileSquares(1,0,0,1);
	
	TopSquares(0,1,0,1);
	TopSquares(0,1,1,1);
	TopSquares(0,0,1,1);
	TopSquares(1,0,1,1);
	TopSquares(1,0,0,1);
	TopSquares(1,1,0,1);

	HandleSquares(0,1,1,1);
	HandleSquares(0,0,1,1);
	HandleSquares(1,0,1,1);
	HandleSquares(1,0,0,1);
	HandleSquares(1,1,0,1);
	HandleSquares(0,1,0,1);
	
	CapTriangle(0,0,1,1);
	CapTriangle(1,0,1,1);
	CapTriangle(1,0,0,1);
	CapTriangle(1,1,0,1);
	CapTriangle(0,1,0,1);
	CapTriangle(0,1,1,1);
	
	
   return TopCounterHandle+TopCounterTop+TopCounterBot+TopCounterCap+TopCounterMid;
   
}
function DrawTop(Parent, index){
	
	var LocalTransformMatrix = new Transform();
	LocalTransformMatrix.propagateTransforms(Parent.matrix);

	if(debug == 0){
		
		updateModelMatrix(LocalTransformMatrix.matrix);
		
		gl.drawArrays(gl.TRIANGLES, index, TopCounterBot);
		gl.drawArrays(gl.TRIANGLES, index+TopCounterBot,TopCounterMid);
		gl.drawArrays(gl.TRIANGLES, index+TopCounterBot+TopCounterMid, TopCounterTop);
		gl.drawArrays(gl.TRIANGLES, index+TopCounterBot+TopCounterMid+TopCounterTop, TopCounterHandle);
		gl.drawArrays(gl.TRIANGLES, index+TopCounterBot+TopCounterMid+TopCounterTop+TopCounterHandle, TopCounterCap);
	}
	
	
	if(debug ==1){
		updateModelMatrix(LocalTransformMatrix.matrix);
		gl.drawArrays(gl.LINES, 4,6);
	}
}

function BottomTriangle(color1, color2, color3,color4){
	
	appendPositions([ Vector1.elements[0], Vector1.elements[1], Vector1.elements[2], Vector1.elements[3],  
					Vector0.elements[0], Vector0.elements[1], Vector0.elements[2], Vector0.elements[3], ]);

	Vector1 = Rotation.multiplyVector4(Vector1);

	appendPositions([ Vector1.elements[0], Vector1.elements[1], Vector1.elements[2], Vector1.elements[3],]);
	
	appendColors([
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					
				  ]);
TopCounterBot+= 3;}

function MiddileSquares(color1, color2, color3,color4){
	
	
	
	appendPositions([ Vector2.elements[0], Vector2.elements[1], Vector2.elements[2], Vector2.elements[3],
					  Vector1.elements[0], Vector1.elements[1], Vector1.elements[2], Vector1.elements[3],  
					 ]);

	Vector1 = Rotation.multiplyVector4(Vector1);

	appendPositions([ Vector1.elements[0], Vector1.elements[1], Vector1.elements[2], Vector1.elements[3],
					  Vector2.elements[0], Vector2.elements[1], Vector2.elements[2], Vector2.elements[3],
						]);
	
	Vector2 = Rotation.multiplyVector4(Vector2);
	
	appendPositions([   Vector1.elements[0], Vector1.elements[1], Vector1.elements[2], Vector1.elements[3],
						Vector2.elements[0], Vector2.elements[1], Vector2.elements[2], Vector2.elements[3],
						
						]);
	
	appendColors([
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					
				  ]);
TopCounterMid+= 6;}

function TopSquares(color1, color2, color3,color4){
	
	
	appendPositions([  Vector3.elements[0], Vector3.elements[1], Vector3.elements[2], Vector3.elements[3],
						Vector2.elements[0], Vector2.elements[1], Vector2.elements[2], Vector2.elements[3], 
					]);

	Vector2 = Rotation.multiplyVector4(Vector2);

	appendPositions([ 	Vector2.elements[0], Vector2.elements[1], Vector2.elements[2], Vector2.elements[3],
						Vector3.elements[0], Vector3.elements[1], Vector3.elements[2], Vector3.elements[3], 
						]);
	
	Vector3 = Rotation.multiplyVector4(Vector3);
	
	appendPositions([ 	Vector2.elements[0], Vector2.elements[1], Vector2.elements[2], Vector2.elements[3],
						Vector3.elements[0], Vector3.elements[1], Vector3.elements[2], Vector3.elements[3],
						]);
	
	appendColors([
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					
				  ]);
TopCounterTop+= 6;}

function HandleSquares(color1, color2, color3,color4){
	
	appendPositions([ 	Vector5.elements[0], Vector5.elements[1], Vector5.elements[2], Vector5.elements[3], 
						Vector3.elements[0], Vector3.elements[1], Vector3.elements[2], Vector3.elements[3],  
					]);

	Vector3 = Rotation.multiplyVector4(Vector3);

	appendPositions([ Vector3.elements[0], Vector3.elements[1], Vector3.elements[2], Vector3.elements[3],
						Vector5.elements[0], Vector5.elements[1], Vector5.elements[2], Vector5.elements[3],]);
	
	Vector5 = Rotation.multiplyVector4(Vector5);
	
	appendPositions([ 	Vector3.elements[0], Vector3.elements[1], Vector3.elements[2], Vector3.elements[3],
						Vector5.elements[0], Vector5.elements[1], Vector5.elements[2], Vector5.elements[3],
						]);
	
	appendColors([
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					
				  ]);
TopCounterHandle+= 6;}

function CapTriangle(color1, color2, color3,color4){
	
	appendPositions([ Vector5.elements[0], Vector5.elements[1], Vector5.elements[2], Vector5.elements[3],  
					Vector6.elements[0], Vector6.elements[1], Vector6.elements[2], Vector6.elements[3], ]);

	Vector5 = Rotation.multiplyVector4(Vector5);

	appendPositions([ Vector5.elements[0], Vector5.elements[1], Vector5.elements[2], Vector5.elements[3],]);
	
	appendColors([
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					color1, color2, color3, color4,          
					
				  ]);
TopCounterCap+= 3;}