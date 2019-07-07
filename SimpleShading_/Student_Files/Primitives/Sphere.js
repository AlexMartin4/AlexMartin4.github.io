function AppendSphere(color){
	
  var SPHERE_DIV = 13;
  sphereCounter = 0;
  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;


  var positions = [];


  // Generate coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(new Vector3([si*sj, cj, ci*sj]));
	  
    }
	
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV+1) + i;
      p2 = p1 + (SPHERE_DIV+1);

	appendPositions([ positions[p1].elements[0], positions[p1].elements[1], positions[p1].elements[2], 1.0, 
					positions[p2].elements[0], positions[p2].elements[1], positions[p2].elements[2], 1.0,
					positions[p1+1].elements[0], positions[p1+1].elements[1], positions[p1+1].elements[2], 1.0, 
					]);
	appendNormals([ positions[p1].elements[0], positions[p1].elements[1], positions[p1].elements[2], 
					positions[p2].elements[0], positions[p2].elements[1], positions[p2].elements[2], 
					positions[p1+1].elements[0], positions[p1+1].elements[1], positions[p1+1].elements[2],
					]);
	appendColors([ color.elements[0], color.elements[1], color.elements[2], color.elements[3], 
				   color.elements[0], color.elements[1], color.elements[2], color.elements[3], 
				   color.elements[0], color.elements[1], color.elements[2], color.elements[3], ]);

	appendPositions([ positions[p1+1].elements[0], positions[p1+1].elements[1], positions[p1+1].elements[2], 1.0, 
					positions[p2].elements[0], positions[p2].elements[1], positions[p2].elements[2], 1.0,
					positions[p2+1].elements[0], positions[p2+1].elements[1], positions[p2+1].elements[2], 1.0, 
					]);
	appendNormals([ positions[p1+1].elements[0], positions[p1+1].elements[1], positions[p1+1].elements[2], 
					positions[p2].elements[0], positions[p2].elements[1], positions[p2].elements[2], 
					positions[p2+1].elements[0], positions[p2+1].elements[1], positions[p2+1].elements[2], 
					]);
	appendColors([ color.elements[0], color.elements[1], color.elements[2], color.elements[3], 
				   color.elements[0], color.elements[1], color.elements[2], color.elements[3], 
				   color.elements[0], color.elements[1], color.elements[2], color.elements[3], ]);
				   
	  sphereCounter+=6;
    }
  }
  return sphereCounter;
}

function DrawSphere(Parent, index, mat1){
	
	if(mat1){
		updateMaterial(mat1);
	}
	updateModelMatrix(Parent);
	updateNormalMatrix(Parent);
	if(debug == 0){
		gl.drawArrays(gl.TRIANGLES, index, sphereCounter);
	}
	DrawDebug(Parent);
}