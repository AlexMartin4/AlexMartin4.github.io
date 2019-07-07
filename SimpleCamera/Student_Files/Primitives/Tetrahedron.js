triangleSeparationAngle = 55.2;
separationDistance = 0.33;

function AppendTetra() {
  gl = init();
  
//*********** VERTICES ***************//
  
  //Double bend diamond
  var PositiveRotation = new Matrix4(); //Rotation ar the x-axis
  var NegativeRotation = new Matrix4();   //Rotation around the x-axis
  
  //Transform the top vertex
  PositiveRotation.rotate(triangleSeparationAngle,1,0,0);
  //PositiveRotation.printMe();
  
  //Transform the bottom vertex
  NegativeRotation.rotate(triangleSeparationAngle, -1, 0, 0);
  
  
  var TopVec4 = new Vector4([0.0, 0.8, 0.0, 1.0]);
  TopVec4 =  PositiveRotation.multiplyVector4(TopVec4);
  
  var BotVec4 = new Vector4([0.0, -0.8, 0.0, 1.0]);
  BotVec4 = NegativeRotation.multiplyVector4(BotVec4);
  
  var hEdge = (0.8*Math.tan(Math.PI/6));   // find equilateral edge half-length
  //console.log("width +/-hx:", hEdge);
  
  var RightVec4 = new Vector4([hEdge, 0.0, 0.0, 1.0]);
  var LeftVec4 = new Vector4([-hEdge, 0.0, 0.0, 1.0]);
  
  //**********VERTICES END*************//
  appendPositions([  
					  //TETRA PIECES
					  BotVec4.elements[0], BotVec4.elements[1], BotVec4.elements[2], BotVec4.elements[3],
					  RightVec4.elements[0], RightVec4.elements[1], RightVec4.elements[2], RightVec4.elements[3],
					  LeftVec4.elements[0], LeftVec4.elements[1], LeftVec4.elements[2], LeftVec4.elements[3],
					  TopVec4.elements[0], TopVec4.elements[1], TopVec4.elements[2], TopVec4.elements[3],

                  ]);
  appendColors([1.0, 0.0, 0.0, 1.0,     //red
                0.0, 1.0, 0.0, 1.0,     //green
                0.0, 0.0, 1.0, 1.0,     //blue
                1.0, 1.0, 1.0, 1.0,     //white
				
              ]); 
	return 4;
}


function DrawTetrahedron(Parent,index){
	
	if(debug == 0){
		pushMatrix(Parent);
			Parent.translate(separationDistance,0,0);
			Parent.rotate(-90, 0,1,0);	

			gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
			gl.drawArrays(gl.TRIANGLE_STRIP,index,4);
		Parent = popMatrix();
		
		pushMatrix(Parent);
			Parent.translate(-separationDistance,0,0);
			Parent.rotate(90,0,1,0);
			Parent.rotate(90,0,0,1);	
			gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
			gl.drawArrays(gl.TRIANGLE_STRIP,index,4);
		popMatrix();
	}
	else{
		gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
		DrawDebug(Parent);
	}
}