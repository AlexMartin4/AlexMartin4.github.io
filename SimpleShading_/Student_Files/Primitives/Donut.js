vertexCounterDonut = 0;
lastSavedDonutRotation =  new Matrix4();

function AppendDonut(ColorTop, ColorBase){
	
	
	var rbend = 1.0;										// Radius of circle formed by torus' bent bar
	var rbar = 0.5;											// radius of the bar we bent to form torus
	var barSlices = 23;									// # of bar-segments in the torus: >=3 req'd;
	var barSides = 13;										// # of sides of the bar (and thus the 

	
	var color = ColorTop;
	var phi=0, theta=0;										// begin torus at angles 0,0
	var thetaStep = 2*Math.PI/barSlices;	// theta angle between each bar segment
	var phiHalfStep = Math.PI/barSides;		// half-phi angle between each side of bar
																			// (WHY HALF? 2 vertices per step in phi)

	for(s=0; s <barSlices+1; s++) {		// for each 'slice' or 'ring' of the torus:
		for(v=0; v< 2*barSides; v++) {		// for each vertex in this slice:
			var x; var y; var z;
			if(v%2==0)	{	
				
				x = (rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.cos((s)*thetaStep);
				y =(rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.sin((s)*thetaStep);
				z = -rbar*Math.sin((v)*phiHalfStep);
				
				
				appendPositions([x, y, z, 1.0,]);
				appendNormals([x-rbend*Math.cos((s)*thetaStep), y - rbend*Math.sin((s)*thetaStep), z]);
				
			}
			else {		
				x = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.cos((s+1)*thetaStep);
				y = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.sin((s+1)*thetaStep)
				z = -rbar*Math.sin((v-1)*phiHalfStep);
				appendPositions([x, y, z, 1.0,]);
				//Use for smooth surface 
				//appendNormals([x-rbend*Math.cos((s+1)*thetaStep), y - rbend*Math.sin((s+1)*thetaStep), z]);
				appendNormals([x-rbend*Math.cos((s)*thetaStep), y - rbend*Math.sin((s)*thetaStep), z]);
				
			}
			appendColors([color.elements[0], color.elements[1], color.elements[2], color.elements[3],]); 
			
			//appendNormals([0,0,1]);
			vertexCounterDonut++;
		}
	}
	console.log(vertexCounterDonut);
	return vertexCounterDonut;
}

function DrawDonut(index, Parent, mat1){
	
	if(mat1){
		updateMaterial(mat1);
	}
	
	updateModelMatrix(Parent);
	updateNormalMatrix(Parent);
	
	if(debug == 0){
		
		gl.disable(gl.CULL_FACE);
		//console.log("Index: " + index + " Verteces: " + vertexCounterDonut);
		gl.drawArrays(gl.TRIANGLE_STRIP, index, vertexCounterDonut);
		gl.enable(gl.CULL_FACE);
	}
	DrawDebug(Parent);
}
