globalRotationAngle = 0;

function AppendPara(smallSide, largeSide, length) {


  var VectorSmallBL = new Vector4([-smallSide/2,-smallSide/2,-length/2,1]);
  var VectorSmallTL = new Vector4([-smallSide/2,smallSide/2,-length/2,1]);
  var VectorSmallTR = new Vector4([smallSide/2,smallSide/2,-length/2,1]);
  var VectorSmallBR = new Vector4([smallSide/2,-smallSide/2,-length/2,1]);
  
  var VectorLargeBL = new Vector4([-largeSide/2,-largeSide/2,length/2,1]);
  var VectorLargeTL = new Vector4([-largeSide/2,largeSide/2,length/2,1]);
  var VectorLargeTR = new Vector4([largeSide/2,largeSide/2,length/2,1]);
  var VectorLargeBR = new Vector4([largeSide/2,-largeSide/2,length/2,1]);
  
  var slantComponent = largeSide-smallSide;

 
  
  appendPositions([	
					//FACE #01 (RED)
					VectorSmallBL.elements[0], VectorSmallBL.elements[1],VectorSmallBL.elements[2], VectorSmallBL.elements[3],
					VectorSmallTL.elements[0], VectorSmallTL.elements[1],VectorSmallTL.elements[2], VectorSmallTL.elements[3],
					VectorSmallBR.elements[0], VectorSmallBR.elements[1],VectorSmallBR.elements[2], VectorSmallBR.elements[3],
					VectorSmallTR.elements[0], VectorSmallTR.elements[1],VectorSmallTR.elements[2], VectorSmallTR.elements[3],
					
					//FACE #02 (GREEN)
					VectorLargeBL.elements[0], VectorLargeBL.elements[1],VectorLargeBL.elements[2], VectorLargeBL.elements[3],
					VectorLargeBR.elements[0], VectorLargeBR.elements[1],VectorLargeBR.elements[2], VectorLargeBR.elements[3],
					VectorLargeTL.elements[0], VectorLargeTL.elements[1],VectorLargeTL.elements[2], VectorLargeTL.elements[3],
					VectorLargeTR.elements[0], VectorLargeTR.elements[1],VectorLargeTR.elements[2], VectorLargeTR.elements[3],
					
					//FACE #03 (BLUE)
					VectorSmallTL.elements[0], VectorSmallTL.elements[1],VectorSmallTL.elements[2], VectorSmallTL.elements[3],
					VectorLargeTL.elements[0], VectorLargeTL.elements[1],VectorLargeTL.elements[2], VectorLargeTL.elements[3],
					VectorSmallTR.elements[0], VectorSmallTR.elements[1],VectorSmallTR.elements[2], VectorSmallTR.elements[3],
					VectorLargeTR.elements[0], VectorLargeTR.elements[1],VectorLargeTR.elements[2], VectorLargeTR.elements[3],
					
					//FACE #04 (YELLOW)
					VectorSmallBL.elements[0], VectorSmallBL.elements[1],VectorSmallBL.elements[2], VectorSmallBL.elements[3],
					VectorSmallBR.elements[0], VectorSmallBR.elements[1],VectorSmallBR.elements[2], VectorSmallBR.elements[3],
					VectorLargeBL.elements[0], VectorLargeBL.elements[1],VectorLargeBL.elements[2], VectorLargeBL.elements[3],
					VectorLargeBR.elements[0], VectorLargeBR.elements[1],VectorLargeBR.elements[2], VectorLargeBR.elements[3],
					
					//FACE #05 (MAGENTA)
					VectorSmallTR.elements[0], VectorSmallTR.elements[1],VectorSmallTR.elements[2], VectorSmallTR.elements[3],
					VectorLargeTR.elements[0], VectorLargeTR.elements[1],VectorLargeTR.elements[2], VectorLargeTR.elements[3],
					VectorSmallBR.elements[0], VectorSmallBR.elements[1],VectorSmallBR.elements[2], VectorSmallBR.elements[3],
					VectorLargeBR.elements[0], VectorLargeBR.elements[1],VectorLargeBR.elements[2], VectorLargeBR.elements[3],
					
					//FACE #06 (CYAN)
					VectorSmallBL.elements[0], VectorSmallBL.elements[1],VectorSmallBL.elements[2], VectorSmallBL.elements[3],
					VectorLargeBL.elements[0], VectorLargeBL.elements[1],VectorLargeBL.elements[2], VectorLargeBL.elements[3],
					VectorSmallTL.elements[0], VectorSmallTL.elements[1],VectorSmallTL.elements[2], VectorSmallTL.elements[3],
					VectorLargeTL.elements[0], VectorLargeTL.elements[1],VectorLargeTL.elements[2], VectorLargeTL.elements[3],
                  ]);
  appendColors([1.0, 0.0, 0.0, 1.0,    //RED
                1.0, 0.0, 0.0, 1.0,     
                1.0, 0.0, 0.0, 1.0,     
                1.0, 0.0, 0.0, 1.0,     
				
				0.0, 1.0, 0.0, 1.0,     //GREEN
                0.0, 1.0, 0.0, 1.0,     
                0.0, 1.0, 0.0, 1.0,      
                0.0, 1.0, 0.0, 1.0,  
				
				0.0, 0.0, 1.0, 1.0,     //BLUE
                0.0, 0.0, 1.0, 1.0,     
                0.0, 0.0, 1.0, 1.0,      
                0.0, 0.0, 1.0, 1.0,
				
				1.0, 1.0, 0.0, 1.0,     //YELLOW
                1.0, 1.0, 0.0, 1.0,     
                1.0, 1.0, 0.0, 1.0,      
                1.0, 1.0, 0.0, 1.0,
				
				1.0, 0.0, 1.0, 1.0,     //MAGENTA
                1.0, 0.0, 1.0, 1.0,     
                1.0, 0.0, 1.0, 1.0,      
                1.0, 0.0, 1.0, 1.0,
				
				0.0, 1.0, 1.0, 1.0,     //CYAN
                0.0, 1.0, 1.0, 1.0,     
                0.0, 1.0, 1.0, 1.0,      
                0.0, 1.0, 1.0, 1.0,
              ]); 
			  
	appendNormals([
					0.0, 0.0, -1.0, //RED
					0.0, 0.0, -1.0, 
					0.0, 0.0, -1.0, 
					0.0, 0.0, -1.0, 
					
					0.0, 0.0,  1.0, //GREEN
					0.0, 0.0,  1.0, 
					0.0, 0.0,  1.0, 
					0.0, 0.0,  1.0, 

					0.0, length, -slantComponent, //BLUE
					0.0, length, -slantComponent,
					0.0, length, -slantComponent,
					0.0, length, -slantComponent,
					
					0.0, -length, -slantComponent, //YELLOW
					0.0, -length, -slantComponent,
					0.0, -length, -slantComponent,
					0.0, -length, -slantComponent,
					
					length, 0.0, -slantComponent, //MAGENTA
					length, 0.0, -slantComponent,
					length, 0.0, -slantComponent,
					length, 0.0, -slantComponent,
					
					-length, 0.0, -slantComponent, //CYAN
					-length, 0.0, -slantComponent,
					-length, 0.0, -slantComponent,
					-length, 0.0, -slantComponent,]);
			
  					
  return 24;
}
function DrawPara(Parent, index, mat1){

	updateModelMatrix(Parent);
	updateNormalMatrix(Parent);
	
	if(mat1){
		updateMaterial(mat1);
	}
	//gl.disable(gl.CULL_FACE);
	if(debug == 0){
		gl.drawArrays(gl.TRIANGLE_STRIP, index,4); 
		gl.drawArrays(gl.TRIANGLE_STRIP,index+4,4); 
		gl.drawArrays(gl.TRIANGLE_STRIP, index+8,4); 
		gl.drawArrays(gl.TRIANGLE_STRIP, index+12,4);
		gl.drawArrays(gl.TRIANGLE_STRIP, index+16,4);
		gl.drawArrays(gl.TRIANGLE_STRIP, index+20,4);
	}
	DrawDebug(Parent);
	
}