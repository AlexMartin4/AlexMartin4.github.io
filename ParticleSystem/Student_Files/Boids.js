var BOIDS_VSHADER =
  'precision mediump float;\n' +				// req'd in OpenGL ES if we use 'float'
  //
  'uniform   int u_runMode; \n' +					// 0=reset; 1= pause; 2=step; 3=run
  'uniform mat4 u_ModelMat;\n' +
  'uniform mat4 u_MVPMat;\n' +
  'uniform vec3 u_EyePos;\n' +
  
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' + 
  'attribute float a_PointSize;\n' +
  'varying   vec4 v_Color; \n' +
  'void main() {\n' +
  'float distance = length(u_EyePos - a_Position.xyz);\n' +
  '  gl_PointSize = a_PointSize/pow(distance, 0.33);\n' +            // TRY MAKING THIS LARGER...
   'mat4 totModelMat =  u_MVPMat * u_ModelMat;\n' +
  '  gl_Position = totModelMat * a_Position;\n' +
  	
	// Let u_runMode determine particle color:
  '  if(u_runMode == 0) { \n' +
	'	   v_Color = vec4(1.0, 0.0, 0.0, 1.0);	\n' +		// red: 0==reset
	'  	 } \n' +
	'  else if(u_runMode == 1) {  \n' +
	'    v_Color = vec4(1.0, 1.0, 0.0, 1.0); \n' +	// yellow: 1==pause
	'    }  \n' +
	'  else if(u_runMode == 2) { \n' +    
	'    v_Color = vec4(0.0, 1.0, 0.0, 1.0); \n' +	// white: 2==step
  '    } \n' +
	'  else { \n' +
	'    v_Color = vec4(a_Color.xyz, 1.0); \n' +	// green: >=3 ==run
	'		 } \n' +
  '} \n';

var BOIDS_FSHADER =
  'precision mediump float;\n' +
  'varying vec4 v_Color; \n' +
  'void main() {\n' +
  '  float dist = distance(gl_PointCoord, vec2(0.5, 0.5)); \n' +
  '  if(dist < 0.5) { \n' +	
	'  	gl_FragColor = vec4((1.0-2.0*dist)*v_Color.rgb, 1.0);\n' +
	'  } else { discard; }\n' +
  '}\n';

PartSys.prototype.initBoids = function(count, out) {
//==============================================================================	
	
	
	
	
    this.partCount = count;
    this.s0 = new Float32Array(this.partCount * PART_MAXVAR);
    this.s1 = new Float32Array(this.partCount * PART_MAXVAR);
	this.s2 = new Float32Array(this.partCount * PART_MAXVAR);
	
	this.lifeTime = 5.0;
	this.age = 0
	this.lastOut = -1000;
	this.outside = out;
	
	this.forceCount = 0;
	this.forces = [];
	
	//Create and add new forces
	

	
	Drag = new CForcer();
	Drag.initDrag(0.5);
	this.forces = this.forces.concat(Drag.attributes);
	this.forceCount++;
	
	Repulsion = new CForcer();
	Repulsion.initBoidsSeparation(0.8);
	this.forces = this.forces.concat(Repulsion.attributes);
	this.forceCount++;
	
	Cohesion = new CForcer();
	Cohesion.initBoidsCohesion(10.0, -0, 0, 4);
	this.forces = this.forces.concat(Cohesion.attributes);
	this.forceCount++;
	
	Alignment = new CForcer();
	Alignment.initBoidsAlignment(0.3);
	this.forces = this.forces.concat(Alignment.attributes);
	this.forceCount++;
	
	Outside = new CForcer();
	Outside.initBoidsOutside(2.0);
	this.forces = this.forces.concat(Outside.attributes);
	this.forceCount++;
	
	this.limitCount = 0;
	this.limiters = [];
	
	//Create and add new constraints 
	Cylinder = new CLimiter();
	Cylinder.initCylinder(5.0, 0.0, 8.0, 0.3);
	this.limiters = this.limiters.concat(Cylinder.attributes);
	this.limitCount++;
	
	var BoidsOutside = new CLimiter();
	BoidsOutside.initBoidsOutside(-3, 3, -3, 3, 0, 8, 2, 8);
	this.limiters = this.limiters.concat(BoidsOutside.attributes);
	this.limitCount++;
	
	/*Walls = new CLimiter();
	Walls.initWalls(-5.0, 5.0,-5.0,5.0, 0.0, 8.0, 0.3);
	this.limiters = this.limiters.concat(Walls.attributes);
	this.limitCount++;*/
	
	
	
	console.log("Forces: " + this.forces);
	console.log("Constraints: " + this.limiters);
	
    this.INIT_VEL =  0.15 * 60.0;	
    this.drag = 0.985;
    this.grav = 9.832;
    this.runMode = 3;	
    this.solvType = 1;
	this.maxSolve = 1;
    this.bounceType = 1;	

    var j = 0;
	for(var i = 0; i < this.outside; i += 1, j+= PART_MAXVAR) {
	  this.s1[j + PART_XPOS] = -5 + Math.random()*10;      // lower-left corner of CVV
      this.s1[j + PART_YPOS] = -5 + Math.random()*10;    // with a 0.1 margin
      this.s1[j + PART_ZPOS] =  Math.random()*8; 
      this.s1[j + PART_WPOS] =  1.0;      // position 'w' coordinate;

	  this.s1[j + PART_R] =  1.0;
      this.s1[j + PART_B] =  0.0;
      this.s1[j + PART_G] =  0.0;
      this.s1[j + PART_MASS] =  1.0;      // mass, in kg.
      this.s1[j + PART_DIAM] =  15      // on-screen diameter, in pixels
	  this.s1[j + PART_AGE] = i*1/this.partCount*this.lifeTime;
	  this.s1[j + PART_CHARGE] = -2;
      this.s1[j + PART_RENDMODE] = 0.0;
	}
    for(var i = this.outside; i < this.partCount; i += 1, j+= PART_MAXVAR) {

      this.s1[j + PART_XPOS] = -5 + Math.random()*10;      // lower-left corner of CVV
      this.s1[j + PART_YPOS] = -5 + Math.random()*10;    // with a 0.1 margin
      this.s1[j + PART_ZPOS] =  Math.random()*8; 
      this.s1[j + PART_WPOS] =  1.0;      // position 'w' coordinate;

      this.s1[j + PART_XVEL] =  0;//this.INIT_VEL;
      this.s1[j + PART_YVEL] =  0;//this.INIT_VEL;
      this.s1[j + PART_ZVEL] =  0;
	  this.s1[j + PART_R] =  1.0;
      this.s1[j + PART_B] =  1.0;
      this.s1[j + PART_G] =  0.0;
      this.s1[j + PART_MASS] =  1.0;      // mass, in kg.
      this.s1[j + PART_DIAM] =  15      // on-screen diameter, in pixels
	  this.s1[j + PART_AGE] = i*1/this.partCount*this.lifeTime;
      this.s1[j + PART_RENDMODE] = 0.0;
    }
 
    this.FSIZE = this.s0.BYTES_PER_ELEMENT;  // 'float' size, in bytes.
  // Create a vertex buffer object (VBO) in the graphics hardware: get its ID# 
	this.shaderLoc = createProgram(gl, BOIDS_VSHADER, BOIDS_FSHADER); 
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
	  return;
    }
  
  
    this.vboID = gl.createBuffer();
    if (!this.vboID) {
      console.log('PartSys.init() Failed to create the VBO object in the GPU');
      return -1;
    }
   
  
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
  
    // Write data from our JavaScript array to graphics systems' buffer object:
    gl.bufferData(gl.ARRAY_BUFFER, this.s0, gl.DYNAMIC_DRAW);


    this.a_PositionID = gl.getAttribLocation(this.shaderLoc, 'a_Position');
    if(this.a_PositionID < 0) {
      console.log('PartSys.init() Failed to get the storage location of a_Position');
      return -1;
    }

	gl.vertexAttribPointer(this.a_PositionID, 
        4,  // # of values in this attrib (1,2,3,4) 
        gl.FLOAT, // data type (usually gl.FLOAT)
        false,    // use integer normalizing? (usually false)
        PART_MAXVAR*this.FSIZE,  // Stride: #bytes from 1st stored value to next one
        PART_XPOS * this.FSIZE); // Offset; #bytes from start of buffer to 

	gl.enableVertexAttribArray(this.a_PositionID);
	
	
	this.a_ColorID = gl.getAttribLocation(this.shaderLoc, 'a_Color');
    if(this.a_Color < 0) {
      console.log('PartSys.init() Failed to get the storage location of a_Color');
      return -1;
    }

	gl.vertexAttribPointer(this.a_ColorID, 
        3,  // # of values in this attrib (1,2,3,4) 
        gl.FLOAT, // data type (usually gl.FLOAT)
        false,    // use integer normalizing? (usually false)
        PART_MAXVAR*this.FSIZE,  // Stride: #bytes from 1st stored value to next one
        PART_R * this.FSIZE); // Offset; #bytes from start of buffer to 

	gl.enableVertexAttribArray(this.a_ColorID);
	
	
	this.a_PointSizeID = gl.getAttribLocation(this.shaderLoc, 'a_PointSize');
    if(this.a_PointSizeID < 0) {
      console.log('PartSys.init() Failed to get the storage location of a_PointSize');
    }
	
	gl.vertexAttribPointer(this.a_PointSizeID, 
        1,  // # of values in this attrib (1,2,3,4) 
        gl.FLOAT, // data type (usually gl.FLOAT)
        false,    // use integer normalizing? (usually false)
        PART_MAXVAR*this.FSIZE,  // Stride: #bytes from 1st stored value to next one
        PART_DIAM * this.FSIZE); // Offset; #bytes from start of buffer to 

	gl.enableVertexAttribArray(this.a_PointSizeID);
   
    this.u_runModeID = gl.getUniformLocation(this.shaderLoc, 'u_runMode');
    if(!this.u_runModeID) {
    	console.log('PartSys.init() Failed to get u_runMode variable location');
    	return;
    }
	
	
	this.u_runModeID = gl.getUniformLocation(this.shaderLoc, 'u_runMode');
    if(!this.u_runModeID) {
    	console.log('PartSys.init() Failed to get u_runMode variable location');
    	return;
    }
	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat');
    if(!this.u_ModelMatLoc) {
    	console.log('PartSys.init() Failed to get u_ModelMat variable location');
    	return;
    }
	
	this.u_MVPMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMat');
    if(!this.u_MVPMatLoc) {
    	console.log('PartSys.init() Failed to get u_MVPMat variable location');
    	return;
    }
	
	this.u_EyePosLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePos');
	if(!this.u_EyePosLoc) {
    	console.log('PartSys.init() Failed to get u_EyePos variable location');
    	return;
    }
	
    // Set the initial values of all uniforms on GPU: (runMode set by keyboard callbacks)
  	gl.uniform1i(this.u_runModeID, this.runMode);
}
