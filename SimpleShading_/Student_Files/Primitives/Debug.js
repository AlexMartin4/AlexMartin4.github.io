function AppendDebug() {
  gl = init();
  

  appendPositions([  
					  //DEBUG AXES
					  0,0,0,1,
					  1.5,0,0,1,
					  0,0,0,1,
					  0,1.5,0,1,
					  0,0,0,1,
					  0,0,1.5,1,
                  ]);
  appendColors([			
				1.0, 0.0, 0.0, 1.0,     // RED x-axis
                1.0, 0.0, 0.0, 1.0,     
                0.0, 1.0, 0.0, 1.0,     // GREEN y-axis
                0.0, 1.0, 0.0, 1.0, 
				0.0, 0.0, 1.0, 1.0,		//BLUE z-axis
				0.0, 0.0, 1.0, 1.0,
				
              ]); 
			  
			  
	appendNormals([ 1.0, 0.0, 0.0,
					1.0, 0.0, 0.0,
					0.0, 1.0, 0.0,
					0.0, 1.0, 0.0,
					0.0, 0.0, 1.0,
					0.0, 0.0, 1.0,]);
	return 6;
}

function DrawDebug(Parent){
	if(debug == 1){
	updateModelMatrix(Parent);
	updateNormalMatrix(Parent);
	
	updateMaterial(MATL_EMIT_RED);
	gl.drawArrays(gl.LINES,debugIndex,2);
	updateMaterial(MATL_EMIT_GRN);
	gl.drawArrays(gl.LINES,debugIndex+2,2);
	updateMaterial(MATL_EMIT_BLU);
	gl.drawArrays(gl.LINES,debugIndex+4,2);
	}
}
