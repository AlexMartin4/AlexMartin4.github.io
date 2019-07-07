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
	// s counts slices of the bar; v counts vertices within one slice; j counts
	// array elements (Float32) (vertices*#attribs/vertex) put in torVerts array.
	for(s=0; s <barSlices; s++) {		// for each 'slice' or 'ring' of the torus:
		for(v=0; v< 2*barSides; v++) {		// for each vertex in this slice:
			if(v%2==0)	{	
				appendPositions([(rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.cos((s)*thetaStep),
								(rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.sin((s)*thetaStep), 
								-rbar*Math.sin((v)*phiHalfStep),
								1.0,]);

			}
			else {				
					appendPositions([(rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.cos((s+1)*thetaStep),
								(rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.sin((s+1)*thetaStep), 
								-rbar*Math.sin((v-1)*phiHalfStep),
								1.0,]);
			}
			if( v < barSides+3 || v >  2*barSides-1){ color = ColorBase;}
			else{color = ColorTop;}
			appendColors([color.elements[0], color.elements[1], color.elements[2], color.elements[3],]); 
			vertexCounterDonut++;
		}
	}
	console.log(vertexCounterDonut);
	return vertexCounterDonut;
}

function DrawDonut(index, Parent){
	
	gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
	if(debug == 0){
		
		gl.disable(gl.CULL_FACE);
		//console.log("Index: " + index + " Verteces: " + vertexCounterDonut);
		gl.drawArrays(gl.TRIANGLE_STRIP, index, vertexCounterDonut);
	}
	DrawDebug(Parent);
}
