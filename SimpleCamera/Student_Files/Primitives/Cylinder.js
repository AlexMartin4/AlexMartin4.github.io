Verteces = 15;

function AppendCylinder(smallRadius, largeRadius, length, color1, color2) {
  
   CylCounterSide = 0;
   CylCounterTop = 0;
   CylCounterBot = 0;
   var Rotation = 360/Verteces;
   var RotateAroundZ = new Matrix4();
   RotateAroundZ.setIdentity();
   
   RotateAroundZ.rotate(Rotation,0,0,1);
   
   
   var Vertex1 = new Vector4([smallRadius,0,length/2,1]);
   var Vertex2 = new Vector4([largeRadius,0,-length/2,1])

   var i;
   for( i = 0; i < Verteces+1; i++){
	   Vertex1 = RotateAroundZ.multiplyVector4(Vertex1);
	   Vertex2 = RotateAroundZ.multiplyVector4(Vertex2);

		appendPositions([	Vertex1.elements[0], Vertex1.elements[1], Vertex1.elements[2], Vertex1.elements[3],
							Vertex2.elements[0], Vertex2.elements[1], Vertex2.elements[2], Vertex2.elements[3],
						  ]);
		appendColors([
					color1.elements[0],  color1.elements[1],   color1.elements[2],   color1.elements[3],       
					color2.elements[0],  color2.elements[1],   color2.elements[2],   color2.elements[3],       
				  ]); 
				  
		CylCounterSide+=2;
   }
   //Top face
   var VertexTop = new Vector4([0,0,length/2,1]);
   
   appendPositions([VertexTop.elements[0], VertexTop.elements[1], VertexTop.elements[2], VertexTop.elements[3]]);
   appendColors([color1.elements[0],  color1.elements[1],   color1.elements[2],   color1.elements[3],  ])
   
   CylCounterTop++;
   
   
   for( i = 0; i < Verteces+1; i++){
	   Vertex1 = RotateAroundZ.multiplyVector4(Vertex1);

		appendPositions([	Vertex1.elements[0], Vertex1.elements[1], Vertex1.elements[2], Vertex1.elements[3],
						  ]);
		appendColors([
					color1.elements[0],  color1.elements[1],   color1.elements[2],   color1.elements[3],         
				  ]); 
				  
		CylCounterTop++;
   }
   //console.log("Top Face Verteces: " + CylCounterTop);
   //Bottom Face
   var VertexBot = new Vector4([0,0,-length/2,1]);
   
   appendPositions([VertexBot.elements[0], VertexBot.elements[1], VertexBot.elements[2], VertexBot.elements[3]]);
   appendColors([color2.elements[0],  color2.elements[1],   color2.elements[2],   color2.elements[3], ])
   
   CylCounterBot++;
   RotateAroundZ.setRotate(-Rotation,0,0,1);
   
   for( i = 0; i < Verteces+1; i++){
	   Vertex2 = RotateAroundZ.multiplyVector4(Vertex2);

		appendPositions([Vertex2.elements[0], Vertex2.elements[1], Vertex2.elements[2], Vertex2.elements[3],
						  ]);
		appendColors([
					color2.elements[0],  color2.elements[1],   color2.elements[2],   color2.elements[3],       
				  ]); 
				  
		CylCounterBot++;
   }
   
   return CylCounterSide+CylCounterTop+CylCounterBot;
}
function DrawCylinder(Parent, index){
	
	gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
	if(debug == 0){
		
		
		gl.drawArrays(gl.TRIANGLE_STRIP, index, CylCounterSide);
		// console.log("Top Face Verteces: " + CylCounterTop);
		gl.drawArrays(gl.TRIANGLE_FAN, index+CylCounterSide, CylCounterTop);
		gl.drawArrays(gl.TRIANGLE_FAN, index+CylCounterSide+CylCounterTop, CylCounterBot);
	}
	
	
	DrawDebug(Parent);
}