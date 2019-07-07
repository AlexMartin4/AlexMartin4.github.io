Verteces = 20;

function AppendCylinder() {
  
   CylCounterSide = 0;
   CylCounterTop = 0;
   CylCounterBot = 0;
   var Rotation = -360/Verteces;
   var RotateAroundZ = new Matrix4();
   RotateAroundZ.setIdentity();
   
   RotateAroundZ.rotate(Rotation,0,0,1);
   
   
   var Vertex1 = new Vector4([0.5,0,0.5,1]);
   var Vertex2 = new Vector4([0.5,0,-0.5,1])

   var i;
   for( i = 0; i < Verteces+1; i++){
	   Vertex1 = RotateAroundZ.multiplyVector4(Vertex1);
	   Vertex2 = RotateAroundZ.multiplyVector4(Vertex2);

		appendPositions([	Vertex1.elements[0], Vertex1.elements[1], Vertex1.elements[2], Vertex1.elements[3],
							Vertex2.elements[0], Vertex2.elements[1], Vertex2.elements[2], Vertex2.elements[3],
						  ]);
		appendColors([
					0.0, 1.0, 1.0, 1.0,     
					1.0, 0.0, 1.0, 1.0,     
				  ]); 
				  
		CylCounterSide+=2;
   }
   //Top face
   var VertexTop = new Vector4([0,0,0.5,1]);
   
   appendPositions([VertexTop.elements[0], VertexTop.elements[1], VertexTop.elements[2], VertexTop.elements[3]]);
   appendColors([0.0, 0.0, 1.0, 1.0,])
   
   CylCounterTop++;
   
   
   for( i = 0; i < Verteces+1; i++){
	   Vertex1 = RotateAroundZ.multiplyVector4(Vertex1);

		appendPositions([	Vertex1.elements[0], Vertex1.elements[1], Vertex1.elements[2], Vertex1.elements[3],
						  ]);
		appendColors([
					0.0, 1.0, 1.0, 1.0,        
				  ]); 
				  
		CylCounterTop++;
   }
   //console.log("Top Face Verteces: " + CylCounterTop);
   //Bottom Face
   var VertexBot = new Vector4([0,0,-0.5,1]);
   
   appendPositions([VertexBot.elements[0], VertexBot.elements[1], VertexBot.elements[2], VertexBot.elements[3]]);
   appendColors([0.0, 0.0, 1.0, 1.0,])
   
   CylCounterBot++;
   RotateAroundZ.setRotate(-Rotation,0,0,1);
   
   for( i = 0; i < Verteces+1; i++){
	   Vertex2 = RotateAroundZ.multiplyVector4(Vertex2);

		appendPositions([Vertex2.elements[0], Vertex2.elements[1], Vertex2.elements[2], Vertex2.elements[3],
						  ]);
		appendColors([
					1.0, 0.0, 1.0, 1.0,        
				  ]); 
				  
		CylCounterBot++;
   }
   
   return CylCounterSide+CylCounterTop+CylCounterBot;
}
function DrawCylinder(Parent, index){
	
	if(debug == 0){
		var LocalTransformMatrix = new Transform();
		//LocalTransformMatrix.matrix.rotate(90,0,1,0);
		LocalTransformMatrix.propagateTransforms(Parent.matrix);
		updateModelMatrix(LocalTransformMatrix.matrix);
		
		gl.drawArrays(gl.TRIANGLE_STRIP, index, CylCounterSide);
		// console.log("Top Face Verteces: " + CylCounterTop);
		gl.drawArrays(gl.TRIANGLE_FAN, index+CylCounterSide, CylCounterTop);
		gl.drawArrays(gl.TRIANGLE_FAN, index+CylCounterSide+CylCounterTop, CylCounterBot);
	}
	
	
	if(debug ==1){
		updateModelMatrix(Parent.matrix);
		gl.drawArrays(gl.LINES, 4,6);
	}
}