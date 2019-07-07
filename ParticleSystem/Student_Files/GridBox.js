var GRID_VSHADER =	
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  
  'uniform mat4 u_ModelMat1;\n' +
  'uniform mat4 u_MVPMat1;\n' +
  'attribute vec4 a_Pos1;\n' +
  'attribute vec3 a_Colr1;\n'+
  'varying vec3 v_Colr1;\n' +
  //
  'void main() {\n' +
  'mat4 totModelMat =  u_MVPMat1 * u_ModelMat1;\n' +
  '  gl_Position = totModelMat * a_Pos1;\n' +
  '	 v_Colr1 = a_Colr1;\n' +
  ' }\n';

var GRID_FSHADER = 
  'precision mediump float;\n' +
  'varying vec3 v_Colr1;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Colr1, 1.0);\n' + 
  '}\n';



function GridBox(xCount, yCount, xyMax) {
	
	this.xCount = xCount;
	this.yCount = yCount;
	this.xyMax = xyMax;
	
	var xgap = xyMax/(xCount-1);		// HALF-spacing between lines in x,y;
	var ygap = xyMax/(yCount-1);
	
	this.posDim = 4;
	this.colorDim = 3;
	this.totalDim = this.posDim + this.colorDim;
	
	this.vboVerts = 2*this.xCount + 2*this.yCount + 6;
	
	this.vboContents = new Float32Array (this.totalDim*this.vboVerts );

	for(v=0; v<2*this.xCount; v++) {
		if(v%2==0) {	
			this.vboContents[this.totalDim*v] = -this.xyMax+ v*xgap;
			this.vboContents[this.totalDim*v+1] = -this.xyMax;
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			this.vboContents[this.totalDim*v] = -this.xyMax+ (v-1)*xgap;
			this.vboContents[this.totalDim*v+1] = this.xyMax;									// w.
		}
		this.vboContents[this.totalDim*v+2] = 0.0;
		this.vboContents[this.totalDim*v+3] = 1.0;
		this.vboContents[this.totalDim*v+4] = 0.4;
		this.vboContents[this.totalDim*v+5] = 0.0;
		this.vboContents[this.totalDim*v+6] = 0.0;
		
	}
	for(v=0; v<this.yCount*2; v++) {
		
		var offset = this.totalDim*(v+2*this.xCount);
		if(v%2==0) {	
			
			this.vboContents[offset] = -this.xyMax;
			this.vboContents[offset+1] = -this.xyMax + v*ygap;
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			this.vboContents[offset]  = this.xyMax;	
			this.vboContents[offset + 1] =  -this.xyMax+ (v-1)*ygap; 	
		}
		this.vboContents[offset + 2]  = 0.0;
		this.vboContents[offset + 3]  = 1.0;
		this.vboContents[offset + 4]  = 0.4;
		this.vboContents[offset + 5]  = 0.4;
		this.vboContents[offset + 6]  = 0.0;
		
	}
	
	var offsetGrid = (2*this.xCount + 2*this.yCount)*this.totalDim;
	this.vboContents[offsetGrid] = 0.0; 
	this.vboContents[offsetGrid + 1] = 0.0; 
	this.vboContents[offsetGrid + 2] = 0.0; 
	this.vboContents[offsetGrid + 3] = 1.0; 
	this.vboContents[offsetGrid + 4] = 1.0; 
	this.vboContents[offsetGrid + 5] = 0.0; 
	this.vboContents[offsetGrid+6]  = 0.0; 
	
	offsetGrid+= this.totalDim;
	this.vboContents[offsetGrid] = 10.0; 
	this.vboContents[offsetGrid + 1] = 0.0; 
	this.vboContents[offsetGrid + 2] = 0.0; 
	this.vboContents[offsetGrid + 3] = 1.0; 
	this.vboContents[offsetGrid + 4] = 1.0; 
	this.vboContents[offsetGrid + 5] = 0.0; 
	this.vboContents[offsetGrid + 6] = 0.0; 
	
	offsetGrid+= this.totalDim;
	this.vboContents[offsetGrid] = 0.0; 
	this.vboContents[offsetGrid + 1] = 0.0; 
	this.vboContents[offsetGrid + 2] = 0.0; 
	this.vboContents[offsetGrid + 3] = 1.0; 
	this.vboContents[offsetGrid + 4] = 0.0; 
	this.vboContents[offsetGrid + 5] = 1.0; 
	this.vboContents[offsetGrid + 6] = 0.0; 
	
	offsetGrid+= this.totalDim;
	this.vboContents[offsetGrid] = 0.0; 
	this.vboContents[offsetGrid + 1] = 10.0; 
	this.vboContents[offsetGrid + 2] = 0.0; 
	this.vboContents[offsetGrid + 3] = 1.0; 
	this.vboContents[offsetGrid + 4] = 0.0; 
	this.vboContents[offsetGrid + 5] = 1.0; 
	this.vboContents[offsetGrid + 6] = 0.0; 
	
	offsetGrid+= this.totalDim;
	this.vboContents[offsetGrid] = 0.0; 
	this.vboContents[offsetGrid + 1] = 0.0; 
	this.vboContents[offsetGrid + 2] = 0.0; 
	this.vboContents[offsetGrid + 3] = 1.0; 
	this.vboContents[offsetGrid + 4] = 0.0; 
	this.vboContents[offsetGrid + 5] = 0.0; 
	this.vboContents[offsetGrid + 6] = 1.0; 
	
	offsetGrid+= this.totalDim;
	this.vboContents[offsetGrid] = 0.0; 
	this.vboContents[offsetGrid + 1] = 0.0; 
	this.vboContents[offsetGrid + 2] = 10.0; 
	this.vboContents[offsetGrid + 3] = 1.0; 
	this.vboContents[offsetGrid + 4] = 0.0; 
	this.vboContents[offsetGrid + 5] = 0.0; 
	this.vboContents[offsetGrid + 6] = 1.0; 
	

	this.vboLoc;								
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;
	this.shaderLoc;									// Shader-program address 

//-------------------- Attribute locations in our shaders
	this.a_PosLoc;								
	this.a_ColrLoc;								

//-------------------- Uniform locations &values in our shaders
	this.ModelMat = new Matrix4();		// Transforms CVV axes to model axes.
	this.u_ModelMatLoc;		
	
	this.MVPMat = new Matrix4();		// Transforms CVV axes to model axes.
	this.u_MVPMatLoc;								// GPU location for u_ModelMat uniform
}

GridBox.prototype.init = function() {

	this.shaderLoc = createProgram(gl, GRID_VSHADER, GRID_FSHADER);
	if (!this.shaderLoc) {
		console.log(this.constructor.name + '.init() failed to create executable Shaders on the GPU. Bye!');
		return;
	}

	gl.program = this.shaderLoc;		
	this.vboLoc = gl.createBuffer();	
	if (!this.vboLoc) {
		console.log(this.constructor.name + '.init() failed to create VBO in GPU. Bye!'); 
		return;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboLoc);				// the ID# the GPU uses for this buffer.
	gl.bufferData(gl.ARRAY_BUFFER, this.vboContents, gl.STATIC_DRAW);			
  							 

	this.a_PosLoc = gl.getAttribLocation(this.shaderLoc, 'a_Pos1');
	if(this.a_PosLoc < 0) {
		console.log(this.constructor.name + '.init() Failed to get GPU location of attribute a_Pos1');
		return -1;	// error exit.
	}
	this.a_ColrLoc = gl.getAttribLocation(this.shaderLoc, 'a_Colr1');
	if(this.a_ColrLoc < 0) {
		console.log(this.constructor.name + '.init() failed to get the GPU location of attribute a_Colr1');
		return -1;	// error exit.
	}

//Find all atttribute pointers
	gl.vertexAttribPointer(
		this.a_PosLoc,			//index 
		4,						// size == #dimensions
		gl.FLOAT,			// sizePerElement
		false,				// isNormalized 
		7*this.FSIZE,	// Stride 
		0);						// Offset
		
		
	gl.vertexAttribPointer(this.a_ColrLoc, 3, gl.FLOAT, false, 
  							7*this.FSIZE, 4*this.FSIZE);
							
	gl.enableVertexAttribArray(this.a_PosLoc);
	gl.enableVertexAttribArray(this.a_ColrLoc);
	
	
	
// Find All Uniforms:--------------------------------

	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat1');
	if (!this.u_ModelMatLoc) { 
		console.log(this.constructor.name + '.init() failed to get GPU location for u_ModelMat1 uniform');
		return;
	}
  
	this.u_MVPMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMat1');
	if (!this.u_MVPMatLoc) { 
		console.log(this.constructor.name + '.init() failed to get GPU location for u_MVPMat1 uniform');
		return;
	}
}

GridBox.prototype.adjust = function(MVP_Matrix, BaseModelMat) {
//=============================================================================


  gl.useProgram(this.shaderLoc);	
  this.MVPMat.set(MVP_Matrix);
  this.ModelMat.set(BaseModelMat);
  this.ModelMat.rotate(0, 1, 0, 0);	// rotate drawing axes,
	this.ModelMat.translate(0, 0, 0);							// then translate them.
  
  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_ModelMatLoc,	false, this.ModelMat.elements);	
  gl.uniformMatrix4fv(this.u_MVPMatLoc,	false, this.MVPMat.elements);	


}

GridBox.prototype.draw = function() {
//=============================================================================
//------CAREFUL! RE-BIND YOUR VBO AND RE-ASSIGN SHADER ATTRIBUTES!-------------

	gl.useProgram(this.shaderLoc);	

	//a) Re-bind Buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboLoc);			
	//b) Re-assign attribute pointers
	gl.vertexAttribPointer(this.a_PosLoc, 4, gl.FLOAT, false, 7*this.FSIZE, 0);		// stride, offset
	gl.vertexAttribPointer(this.a_ColrLoc, 3, gl.FLOAT, false,  7*this.FSIZE, 4*this.FSIZE); // stride, offset
  // c) enable the newly-re-assigned attributes:
	gl.enableVertexAttribArray(this.a_PosLoc);
	gl.enableVertexAttribArray(this.a_ColrLoc);

// ----------Draw the contents of the currently-bound VBO:
	gl.drawArrays(gl.LINES, 0, this.vboVerts);		
}