function AppendDebug() {
  gl = init();
  

  appendPositions([  
					  //DEBUG AXES
					  0,0,0,1,
					  0.75,0,0,1,
					  0,0,0,1,
					  0,0.75,0,1,
					  0,0,0,1,
					  0,0,0.75,1,
                  ]);
  appendColors([			
				1.0, 0.0, 0.0, 1.0,     // RED x-axis
                1.0, 0.0, 0.0, 1.0,     
                0.0, 1.0, 0.0, 1.0,     // GREEN y-axis
                0.0, 1.0, 0.0, 1.0, 
				0.0, 0.0, 1.0, 1.0,		//BLUE z-axis
				0.0, 0.0, 1.0, 1.0,
				
              ]); 
	return 6;
}

function DrawDebug(Parent){
	gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
	gl.drawArrays(gl.LINES,debugIndex,6);
}
