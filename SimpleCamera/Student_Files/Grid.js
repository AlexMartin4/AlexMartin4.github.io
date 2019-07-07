function AppendGrid() {
//==============================================================================
// Create a list of vertices that create a large grid of lines in the x,y plane
// centered at x=y=z=0.  Draw this shape using the GL_LINES primitive.

	xcount = 150;			// # of lines to draw in x,y to make the grid.
	ycount = 200;		
	xymax	= 50.0;			// grid size; extends to cover +/-xymax in x and y.
 	

						// draw a grid made of xcount+ycount lines; 2 vertices per line.
						
	var xgap = xymax/(xcount-1);		// HALF-spacing between lines in x,y;
	var ygap = xymax/(ycount-1);		// (why half? because v==(0line number/2))
	
	// First, step thru x values as we make vertical lines of constant-x:
	for(v=0; v<2*xcount; v++) {
		if(v%2==0) {	// put even-numbered vertices at (xnow, -xymax, 0)
			appendPositions([-xymax +v*xgap, -xymax,0.0,1.0]);								// w.
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			appendPositions([-xymax +(v-1)*xgap, +xymax,0.0,1.0]);										// w.
		}
		appendColors([1.0,1.0,0.0,1.0]);
	}
	// Second, step thru y values as wqe make horizontal lines of constant-y:
	// (don't re-initialize j--we're adding more vertices to the array)
	for(v=0; v<2*xcount; v++) {
		if(v%2==0) {	// put even-numbered vertices at (xnow, -xymax, 0)
			appendPositions([-xymax, -xymax +v*xgap ,0.0,1.0]);								// w.
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			appendPositions([+xymax, -xymax +(v-1)*xgap, 0.0, 1.0]);										// w.
		}
		appendColors([0.0,1.0,1.0,1.0]);
	}
	return xcount*2+ycount*2;
}
function DrawGrid(Parent, index){
	
	gl.uniformMatrix4fv(u_ModelMatrix, false, Parent.elements);
	gl.drawArrays(gl.LINES, index, 2*xcount + 2*ycount);
}
