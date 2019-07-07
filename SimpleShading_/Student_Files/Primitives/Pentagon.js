

function AppendPenta() {
  
  
   var RotateAroundZ = new Matrix4();
   RotateAroundZ.setIdentity();
   var Rotation = 72;
   
   var Vertex0 = new Vector4([0,0,0.5,1]);
   var Vertex1 = new Vector4([1,0,0,1]);
   var Vertex2 = new Vector4([1,0,0,1]);
   var Vertex3 = new Vector4([1,0,0,1]);
   var Vertex4 = new Vector4([1,0,0,1]);
   var Vertex5 = new Vector4([1,0,0,1]);

   RotateAroundZ.rotate(Rotation,0,0,1);
   Vertex2 = RotateAroundZ.multiplyVector4(Vertex2);
   //
   RotateAroundZ.rotate(Rotation,0,0,1);
   Vertex3 = RotateAroundZ.multiplyVector4(Vertex3);
   //
   RotateAroundZ.rotate(Rotation,0,0,1);
   Vertex4 = RotateAroundZ.multiplyVector4(Vertex4);
   //
   RotateAroundZ.rotate(Rotation,0,0,1);
   Vertex5 =RotateAroundZ.multiplyVector4(Vertex5);
   
  appendPositions([	Vertex0.elements[0], Vertex0.elements[1], Vertex0.elements[2], Vertex0.elements[3],
					Vertex1.elements[0], Vertex1.elements[1], Vertex1.elements[2], Vertex1.elements[3],
					Vertex2.elements[0], Vertex2.elements[1], Vertex2.elements[2], Vertex2.elements[3],
					Vertex3.elements[0], Vertex3.elements[1], Vertex3.elements[2], Vertex3.elements[3],
					Vertex4.elements[0], Vertex4.elements[1], Vertex4.elements[2], Vertex4.elements[3],
					Vertex5.elements[0], Vertex5.elements[1], Vertex5.elements[2], Vertex5.elements[3],
					Vertex1.elements[0], Vertex1.elements[1], Vertex1.elements[2], Vertex1.elements[3],
					
					
                  ]);
  appendColors([
				1.0, 1.0, 1.0, 1.0,     // RED x-axis
                0.0, 0.0, 1.0, 1.0,     
                0.0, 0.0, 1.0, 1.0,     // GREEN y-axis
                0.0, 0.0, 1.0, 1.0, 
				0.0, 0.0, 1.0, 1.0,		//BLUE z-axis
				0.0, 0.0, 1.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
              ]); 
 
  return 7;
}
function DrawPenta(Parent, index){
	
	var temp = new Matrix4();
	temp.set(Parent);
	
	if(debug == 0){
		pushMatrix(temp);
			temp.rotate(90, 0, 1, 0);	
			gl.uniformMatrix4fv(u_ModelMatrix, false, temp.elements);
			gl.drawArrays(gl.TRIANGLE_FAN, index,7);
		temp = popMatrix();
		pushMatrix(temp);
			temp.rotate(-90, 0,1,0);	
			temp.rotate(36,0,0,1);
			gl.uniformMatrix4fv(u_ModelMatrix, false, temp.elements);
			gl.drawArrays(gl.TRIANGLE_FAN, index,7);
		temp = popMatrix();
	}
	
	else{
		gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
		DrawDebug(Parent);
	}
}