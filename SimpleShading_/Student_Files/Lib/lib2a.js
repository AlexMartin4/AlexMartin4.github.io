// 
//  'Starter code' library to simplify WebGL drawing of transformed vertices,
//  For EECS 351-1, Northwestern University.  
//
//  lib1.js -- 2018.06 CREATED by Vincent Bommier & Jack Tumblin for 
//        EECS 399 Special Projects projects course to help with EECS 351-1.
//        Enables as-simple-as-possible WebGL drawings w/o 'housekeeping'.
//  lib1a.js -- 2019.02.23: added extensive comments, cleanly separated 'user'
//        functions from the 'private' functions.  'Private' functions help 
//        simplify the library's implementation and are not intended for users.
//        Renamed some vars for clarity, and renamed all 'Private' functions by
//        adding a leading underline, such _BufferSetup().
//  lib2a.js -- 2019.02.24: added user fcns appendNormals(),updateNormalMatrix()
//        as part of in-class exercise to aid with Proj C 'lights & materials'
 
// Vertex Shader source code (GLSL)

  
//=============================================================================
//global variables
var gl;                       // webGL rendering context
var numVertices = 4096;
var positionDimensions = 4;   // x,y,z,w
var colorDimensions = 4;      // r,g,b,a
var pointSizeDimensions = 1;  // 
var normalDimensions = 3;   // x,y,z direction vector

// Make local arrays in JS: we will transfer their contents to the GPU.
var positions = new Float32Array(numVertices*positionDimensions);
var colors = new Float32Array(numVertices*colorDimensions);
var pointSizes = new Float32Array(numVertices*pointSizeDimensions);
var normals = new Float32Array(numVertices*normalDimensions);
for(var i = 0; i < numVertices*pointSizeDimensions; i++) {
  pointSizes[i] = 10.0; //set  non-zero default point-size
  }
var FSIZE = positions.BYTES_PER_ELEMENT;    // size of 'float' in bytes
var ipos = 0;           // total # 'position' attributes we will send to GPU
var icolors = 0;        // total # of 'color' attributes we will send to GPU
var ipointSizes = 0;    // total # of 'pointSize' attributes we will send to GPU
var inormals = 0;
var u_ModelMatrixLoc;   // GPU location# for our 'modelMatrix' uniform var.
var u_NormalMatrixLoc;   // GPU location# for our 'normalMatrix' uniform var.
var u_MvpMatrixLoc;   // GPU location# for our 'mvpMatrix' uniform var.
var u_LightColorLoc;
var u_LightPositionLoc;
var u_AmbientLightLoc;
var u_isGoureauShadingLoc;
var u_isPhongLightingLoc;

var modelMatrix = new Matrix4();  // Javascript 4x4 matrix; send contents to GPU.
var matl0 = new Material();
var lamp = [new LightsT(), new LightsT()];

var isGouraud = 1.0;
var isPhong = 1.0;
//===============
//
//  USER FUNCTIONS -- call these!
//
//================

function init(){
//=============================================================================
// For users: Call this fcn at start of main().
 
	//Retrieve <canvas> element from our webpage
	var canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL inside this canvas element
	gl = getWebGLContext(canvas);
	if (!gl) {
	console.log("lib2a.js: init() failed to get WebGL rendering context 'gl'\n");
	console.log("from the HTML-5 Canvas object named 'canvas'!\n\n");
	return;
	}

	// transfer both shaders source code to the GPU, compile, link, and attach 
	// their executables as a GPU 'program' & confirm the GPU is ready for use.
	// (see cuon-utils.js for details).
	if (!initShaders(gl, VSHADER_COMPOUND, FSHADER_COMPOUND)) {
	console.log('lib2a.js: init() failed to intialize shaders.');
	return;
	}

	_BufferSetup(gl);  //  Reserve storage space (VBO) on GPU to hold vertices.


	gl.clearColor(0.3, 0.3, 0.3, 1.0); 
	gl.enable(gl.DEPTH_TEST);   
	gl.enable(gl.CULL_FACE);   
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 


	// Get the GPU location for all 'uniform' variables we will update on GPU:
	u_ModelMatrixLoc = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrixLoc) {
	console.log('lib2a.js: init failed to get the storage location of u_ModelMatrix');
	return;
	}

	u_NormalMatrixLoc = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

	if(!u_NormalMatrixLoc) {
		console.log('Failed to get GPU storage location for u_NormalMatrix');
		//return
	} 
	u_MvpMatrixLoc = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

	if(!u_MvpMatrixLoc) {
		console.log('Failed to get GPU storage location for u_MvpMatrix');
		//return
	}

	u_EyePointLoc = gl.getUniformLocation(gl.program, 'u_EyePoint');

	if(!u_EyePointLoc){
	  console.log('Failed to get GPU storage location for u_EyePoint');
	}
	
	u_isGoureauShadingLoc = gl.getUniformLocation(gl.program, 'isGouraudShading');
	u_isPhongLightingLoc= gl.getUniformLocation(gl.program, 'isPhongLighting');
	
	if(!u_isGoureauShadingLoc){
		console.log('Failed to get GPU storage location for bools (G)');
	}
	if(!u_isPhongLightingLoc){
		console.log('Failed to get GPU storage location for bools (P)');
	}
	
	matl0.uLoc_Ke = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
	matl0.uLoc_Ka = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
	matl0.uLoc_Kd = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
	matl0.uLoc_Ks = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
	matl0.uLoc_Kshiny = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');
	if(!matl0.uLoc_Ke || !matl0.uLoc_Ka || !matl0.uLoc_Kd 
							|| !matl0.uLoc_Ks || !matl0.uLoc_Kshiny
		 ) {
		console.log('Failed to get GPUs Reflectance storage locations');
		//return;
	}
	
	lamp[0].u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[0].pos');	
	lamp[0].u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[0].ambi');
	lamp[0].u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[0].diff');
	lamp[0].u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[0].spec');
	if( !lamp[0].u_pos || !lamp[0].u_ambi	|| !lamp[0].u_diff || !lamp[0].u_spec	) {
		console.log('Failed to get GPUs Lamp[0] storage locations');
	//return;
	}

	lamp[1].u_pos  = gl.getUniformLocation(gl.program, 'u_LampSet[1].pos');	
	lamp[1].u_ambi = gl.getUniformLocation(gl.program, 'u_LampSet[1].ambi');
	lamp[1].u_diff = gl.getUniformLocation(gl.program, 'u_LampSet[1].diff');
	lamp[1].u_spec = gl.getUniformLocation(gl.program, 'u_LampSet[1].spec');
	if( !lamp[1].u_pos || !lamp[1].u_ambi	|| !lamp[1].u_diff || !lamp[1].u_spec	) {
		console.log('Failed to get GPUs Lamp[1] storage locations');
	//return;
	}
	
  
  return gl;
}

function appendPositions(arr){
//=============================================================================
// for users:  sends a Float32array of vertex POSITIONS to the GPU;
// e.g. use these commands in main() to draw a colorful triangle on-screen with
//      large square 'points' at each vertex. 
//      init();
//      appendPositions( [-0.5, -0.5, 0.0, 1.0,     // vertex 0: x,y,z,w 
//                         0.5, -0.5, 0.0, 1.0,     // vertex 1
//                         0.0,  0.5, 0.0, 1.0,]);  // vertex 2
//      appendColors(    [1.0, 0.5, 0.0, 1.0,       // vertex 0: R,G,B,A 
//                        0.2, 1.0, 0.2, 1.0,       // vertex 1
//                        0.2, 0.2, 1.0, 1.0, ]);   // vertex 2
//      appendPointSizes([ 5.0, 10.0, 15.0]);       //
//      gl.drawArrays(gl.TRIANGLES,0,3);            // draw triangle:
//                                       //(start at vertex 0, draw 3 vertices)
//      gl.drawArrays(gl.POINTS, 0, 3);             // draw points.
//
  positions = _Float32Edit(positions,arr,ipos);
  ipos += arr.length;
  if(ipos > numVertices*positionDimensions){
    console.log('Warning! Appending more than ' + numVertices + ' positions to the VBO will overwrite existing data');
    console.log('Hint: look at changing numVertices in lib2a.js');
  }
  for(var i = 0; i < ipos; i++){
	  //console.log("POS -- Vertex #" + i + ": " +positions[i])
  }
  _BufferSetup(gl);
}

function appendColors(arr){
//=============================================================================
// for users:  sends a Float32array of vertex COLORS to the GPU;
  colors = _Float32Edit(colors,arr,icolors);
  icolors += arr.length;
  if(icolors > numVertices*colorDimensions){
    console.log('Warning! Appending more than ' + numVertices + ' colors to the VBO will overwrite existing data');
    console.log('Hint: look at changing numVertices in lib2a.js');
  }
  _BufferSetup(gl);
}

function appendPointSizes(arr){
//=============================================================================
// for users:  sends a Float32array of vertex POINT_SIZEs to the GPU;
  pointSizes = _Float32Edit(pointSizes,arr,ipointSizes);
  ipointSizes += arr.length;
  if(ipointSizes > numVertices*pointSizeDimensions){
    console.log('Warning! Appending more than ' + numVertices + ' point-sizes to the VBO will overwrite existing data');
    console.log('Hint: look at changing numVertices in lib2a.js');
  }
  _BufferSetup(gl);  
}

function appendNormals(arr){
//=============================================================================
// for users:  sends a Float32array of vertex POINT_SIZEs to the GPU;
  normals = _Float32Edit(normals,arr,inormals);
 
  inormals += arr.length;
  if(inormals > numVertices*normalDimensions){
    console.log('Warning! Appending more than ' + numVertices + ' point-sizes to the VBO will overwrite existing data');
    console.log('Hint: look at changing numVertices in lib2a.js');
  }
   for(var i = 0; i < inormals; i++){
	  //console.log("NORM -- Vertex #" + i + ": " +normals[i])
  }
  _BufferSetup(gl);  
}

function updateModelMatrix(matrix){
//=============================================================================
// transfer Matrix4 'matrix' contents to GPU's u_ModelMatrix uniform.
  gl.uniformMatrix4fv(u_ModelMatrixLoc, false, matrix.elements);
}

function updateNormalMatrix(matrix){
//=============================================================================
// transfer Matrix4 'matrix' contents to GPU's u_NormalMatrix uniform.
   var temp = new Matrix4();
   temp.setInverseOf(matrix);
   temp.transpose();
  gl.uniformMatrix4fv(u_NormalMatrixLoc, false, temp.elements);
}

function updateMvpMatrix(matrix){
	gl.uniformMatrix4fv(u_MvpMatrixLoc, false, matrix.elements);
}

function updateEyePoint(newEyePoint){
	gl.uniform3f(u_EyePointLoc, newEyePoint.elements[0], newEyePoint.elements[1], newEyePoint.elements[2]); 
}

function updateLightsT(index){
	
	/*console.log("Pos");
	lamp[index].I_pos.printMe();
	console.log("Ambi");
	lamp[index].I_ambi.printMe();
	console.log("Diff");
	lamp[index].I_diff.printMe();
	console.log("Spec");
	lamp[index].I_spec.printMe();*/
	
	if(lamp[index].u_pos){ gl.uniform3f(lamp[index].u_pos, lamp[index].I_pos.elements[0], lamp[index].I_pos.elements[1], lamp[index].I_pos.elements[2]); }
	else{console.log("lamp[" + index + "].u_pos not found!");}
	
	if(!lamp[index].isLit){

		if(lamp[index].u_ambi){ gl.uniform3f(lamp[index].u_ambi, 0, 0, 0); }
		else{console.log("lamp[" + index + "].u_ambi not found!");}	
		
		if(lamp[index].u_diff){ gl.uniform3f(lamp[index].u_diff, 0, 0, 0); }
		else{console.log("lamp[" + index + "].u_diff not found!");}	
		
		if(lamp[index].u_spec){ gl.uniform3f(lamp[index].u_spec, 0, 0, 0); }
		else{console.log("lamp[" + index + "].u_spec not found!");}	
	}
	else{
		if(lamp[index].u_ambi){ gl.uniform3f(lamp[index].u_ambi, lamp[index].I_ambi.elements[0], lamp[index].I_ambi.elements[1], lamp[index].I_ambi.elements[2] ); }
		else{console.log("lamp[" + index + "].u_ambi not found!");}	
		
		if(lamp[index].u_diff){ gl.uniform3f(lamp[index].u_diff, lamp[index].I_diff.elements[0], lamp[index].I_diff.elements[1], lamp[index].I_diff.elements[2] ); }
		else{console.log("lamp[" + index + "].u_diff not found!");}	
		
		if(lamp[index].u_spec){ gl.uniform3f(lamp[index].u_spec, lamp[index].I_spec.elements[0], lamp[index].I_spec.elements[1], lamp[index].I_spec.elements[2], ); }
		else{console.log("lamp[" + index + "].u_spec not found!");}	
	}
}


function updateMaterial(matIndex){
	matl0.setMatl(matIndex);
	gl.uniform3fv(matl0.uLoc_Ke, matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(matl0.uLoc_Ka, matl0.K_ambi.slice(0,3));				// Ka ambient
	gl.uniform3fv(matl0.uLoc_Kd, matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(matl0.uLoc_Ks, matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(matl0.uLoc_Kshiny, parseInt(matl0.K_shiny, 10));     // Kshiny 
}

function updateLighting(newInt){
	gl.uniform1f(u_isPhongLightingLoc, newInt);
}

function updateShading(newInt){
	gl.uniform1f(u_isGoureauShadingLoc, newInt);
}

function WipeVertices(){
//=============================================================================
// DISCARD all previously appended vertex attributes; clear all VBO contents.
  positions = new Float32Array(numVertices*positionDimensions);
  colors = new Float32Array(numVertices*colorDimensions);
  pointSizes = new Float32Array(numVertices*pointSizeDimensions);
  ipos = icolors = ipointSizes = 0;
  _BufferSetup(gl);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

//=======================
//
//  PRIVATE FUNCTIONS   (called only by other functions within this library)
//                      (all 'private' fcn names begin with underline)               
//
//========================
function _Float32Concat(first, second){ //------------------------------------- 
//concatenate two Float32Arrays
  var firstLength = first.length,
  result = new Float32Array(firstLength + second.length);

  result.set(first);
  result.set(second, firstLength);

  return result;
}

function _Float32Edit(base, edit, startIdx) { //-------------------------------
//overwrite the base float32Array with a smaller 'edit' float32array, 
// offset by startIdx. 
  for(var i = 0; i < edit.length;i++){
    base[i+startIdx] = edit[i];
  }
  return base;
}

function _AssembleVBO(){ //------------------------------------------------------
//Concatenate all attributes into a single array that will fill VBO in the GPU.
  return _Float32Concat(positions,_Float32Concat(colors,_Float32Concat(pointSizes, normals)));
}

function _BufferSetup(gl) {//--------------------------------------------------
//  Create, bind, and fill a 'Vertex Buffer Object' (VBO) in the GPU memory  
// where we store all attributes of all vertices. 'Bind' this VBO object to
// hardware that reads vertex attributes, and assign correct memory locations
// to the corresponding 'attribute' vars in our GLSL shaders.

  var gpuBufferID = gl.createBuffer();   // create a storage object in GPU
  if (!gpuBufferID) {
    console.log('lib2.js: _BufferSetup() failed to create a buffer object on GPU');
    return -1;
  }
  // 'bind' that storage object to the 'target' (hardware) that reads vertex
  // attribute data (ARRAY_BUFFER) and NOT vertex indices (ELEMENT_ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, gpuBufferID);
  // Write date into the buffer object
  var VBOcontents = _AssembleVBO();     // combine all attribs into 1 array,
  gl.bufferData(gl.ARRAY_BUFFER, VBOcontents, gl.STATIC_DRAW);  // xfer to GPU
  // in the currently-bound storage object (set by gl.bindBuffer() call).
  
  // Find the GPU memory locations for our shader's attribute variables:
  var a_PositionLoc = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_PositionLoc < 0) {
    console.log("Failed to find GPU location of our shader's a_Position var");
    return -1;
  }
  var a_ColorLoc = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_ColorLoc < 0) {
    console.log("Failed to find GPU location of our shader's a_Color var");
    return -1;
  }
  var a_PointSizeLoc = gl.getAttribLocation(gl.program, 'a_PointSize');
  if(a_PointSizeLoc < 0) {
    console.log("Failed to find GPU location of our shader's a_PointSize var");
    return -1;
  }
  var a_NormalLoc = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_NormalLoc < 0) {
    console.log("Failed to find GPU location of our shader's a_Normal var");
    //return -1;
  }
  
  
  //The VBOcontents array holds attribute values arranged like this:
  //[x0,y0,z0,w0,...,x1023,y1023,z1023,w1023,    // position attribs for all verts
  // r0,g0,b0,a0,...,r1023,g1023,b1023,a1023,    // color attribs for all verts
  // sz0,sz1, ... ,sz1023, ]                // point-size attribs for all verts
  // and we will transfer its contents to GPU to to fill VBO at gpuBufferID

  // Specify where GPU can find each attribute for each vertex in the VBO:
  // 'a_position' attribute:---------------------------------------------------
  var offset = 0;           // # of bytes offset from start of VBOcontents to 
                            // the first value stored for a given attribute.
  var stride = FSIZE*positionDimensions;  // # bytes to skip to reach next vert.
  gl.vertexAttribPointer(         // Specify how attribute accesses VBO memory:
      a_PositionLoc, // location of this attribute in your GLSL shader program
      positionDimensions,         // # of values used by this attrib: 1,2,3,4?
      gl.FLOAT,                   // data type of each value in this attrib,
      false,                      // isNormalized; are these fixed-point values
                                  // GPU must normalize before use? true/false
      stride,     // #bytes we must skip in the VBO to move from the stored 
                  // attrib for this vertex to the same stored attrib for the 
                  // next vertex.  (If set to zero, the GPU gets attribute 
                  // values sequentially from VBO, starting at 'offset').
      offset);    // How many bytes from START of VBO to the first attribute
  								// value GPU will actually use.
  gl.enableVertexAttribArray(a_PositionLoc); // Enable access to the bound VBO.
  
  // 'a_color' attribute:------------------------------------------------------
  offset += FSIZE*numVertices*positionDimensions; // shift offset from start of 
        // 'position' values to the start of 'color' values stored in the VBO.
  stride = FSIZE*colorDimensions;     // # bytes to skip to reach next vertex.
  gl.vertexAttribPointer(             // Set how attribute accesses VBO memory:
      a_ColorLoc, colorDimensions, gl.FLOAT, false, stride, offset);
  gl.enableVertexAttribArray(a_ColorLoc);  // Enable access to the bound VBO.
  
  // 'a_pointSize' attribute:--------------------------------------------------
  offset += FSIZE*numVertices*colorDimensions;  // shift offset from start of
        // 'color' values to the start of 'pointSize' values stored in VBO.
  stride = FSIZE*pointSizeDimensions; // # bytes to skip to reach next vertex.
  gl.vertexAttribPointer(             // Set how attribute accesses VBO memory:
      a_PointSizeLoc, pointSizeDimensions, gl.FLOAT, false, stride, offset);
  gl.enableVertexAttribArray(a_PointSizeLoc);  // Enable access to the bound VBO.
  
  
  offset += FSIZE*pointSizeDimensions*numVertices;
  stride = FSIZE*normalDimensions;
  
  gl.vertexAttribPointer(
	a_NormalLoc, normalDimensions, gl.FLOAT, false, stride, offset);
  gl.enableVertexAttribArray(a_NormalLoc);
}

