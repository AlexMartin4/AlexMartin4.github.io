function CRay() {
//=============================================================================
// Object for a ray in an unspecified coord. system (usually 'world' coords).
	this.orig = vec4.fromValues(0,0,0,1);			// Ray starting point (x,y,z,w)
																						// (default: at origin
	this.dir = 	vec4.fromValues(0,0,-1,0);			// The ray's direction vector 
																						// (default: look down -z axis)
}

CRay.prototype.printMe = function() {
//=============================================================================
// print ray's values in the console window:
	if(name == undefined) name = ' ';

	console.log('CRay::' + this.constructor.name + '.origin:\t' + this.orig[0] 
	+',\t'+ this.orig[1] +',\t'+ this.orig[2] +',\t'+ this.orig[3]);
	console.log('     ', + this.constructor.name + '.direction:\t' + this.dir[0] 
	+',\t'+  this.dir[1] + '\t'+  this.dir[2] +',\t'+ this.dir[3]);
}



function CCamera() {
//=============================================================================
// Object for a ray-tracing camera defined the 'world' coordinate system, with
// a) -- 'extrinsic' parameters that set the camera's position and aiming
//	from the camera-defining UVN coordinate system 
// (coord. system origin at the eye-point; coord axes U,V define camera image 
// horizontal and vertical; camera gazes along the -N axis): 
// Default settings: put camera eye-point at world-space origin, and
	this.eyePt = vec4.fromValues(gui.camEyePt[0], gui.camEyePt[1], gui.camEyePt[2]+5,1);
	
	this.uAxis = vec4.create();
	this.vAxis = vec4.create();
	this.nAxis = vec4.create();
	
	
	
	this.rayPerspective(gui.camFovy, gui.camAspect, gui.camNear);
	this.raylookAt(gui.camEyePt, gui.camAimPt, vec3.fromValues(0,0,1));
	
	/*
//Straight towards the horizon (X direction)
this.uAxis = vec4.fromValues(0,1,0,0);	// camera U axis == world x axis			
this.vAxis = vec4.fromValues(0,0,1,0);	// camera V axis == world y axis
this.nAxis = vec4.fromValues(1,0,0,0);	// camera N axis == world z axis.
		// (and thus we're gazing down the -Z axis with default camera). 
*/

  // LOOK AT THE HORIZON:
/*
	this.uAxis = vec4.fromValues(1,0,0,0);	// camera U axis == world x axis			
  this.vAxis = vec4.fromValues(0,0,1,0);	// camera V axis == world z axis
  this.nAxis = vec4.fromValues(0,-1,0,0);	// camera N axis == world -y axis.
*/

// b) -- Camera 'intrinsic' parameters that set the camera's optics and images.
// They define the camera's image frustum: its image plane is at N = -znear  
// (the plane that 'splits the universe', perpendicular to N axis), and no 
// 'zfar' plane at all (not needed: ray-tracer doesn't have or need the CVV).  
// The ray-tracing camera creates an rectangular image plane perpendicular to  
// the cam-coord. system N axis at -iNear(defined by N vector in world coords),
// 			horizontally	spanning 'iLeft' <= u <= 'iRight' along the U vector, and
//			vertically    spanning  'iBot' <= v <=  'iTop' along the V vector. 
// As the default camera creates an image plane at distance iNear = 1 from the 
// camera's center-of-projection (at the u,v,n origin), these +/-1 
// defaults define a square ray-traced image with a +/-45-degree field-of-view:
	this.iNear =  1.0;
	this.iLeft = -1.0;		
	this.iRight = 1.0;
	this.iBot =  -1.0;
	this.iTop =   1.0; 

// And the lower-left-most corner of the image is at (u,v,n) = (iLeft,iBot,-iNear).
	this.xmax = g_imgSize;			// horizontal,
	this.ymax = g_imgSize;			// vertical image resolution.
// To ray-trace an image of xmax,ymax pixels, divide this rectangular image 
// plane into xmax,ymax rectangular tiles, and shoot eye-rays from the camera's
// center-of-projection through those tiles to find scene color values.  
// --For the simplest, fastest image (without antialiasing), trace each eye-ray 
// through the CENTER of each tile to find pixel colors.  
// --For slower, better-looking, anti-aliased image making, apply g_isJittered 
// super-sampling: For each pixel:
//			--subdivide the 'tile' into equal-sized 'sub-tiles';
//			--trace one ray per sub-tile, but randomize (g_isJitter) the ray's position 
//					within the sub-tile,
//			--set pixel color to the average of all sub-tile colors. 
// Let's do that:

// Divide the image plane into rectangular tiles, one for each pixel:
	this.ufrac = (this.iRight - this.iLeft) / this.xmax;	// pixel tile's width
	this.vfrac = (this.iTop   - this.iBot ) / this.ymax;	// pixel tile's height.
}

CCamera.prototype.rayFrustum = function(left, right, bot, top, near) {
//==============================================================================
// Set the camera's viewing frustum with the same arguments used by the OpenGL 
// 'glFrustum()' fucntion
// (except this function has no 'far' argument; not needed for ray-tracing).
// Assumes camera's center-of-projection (COP) is at origin and the camera gazes
// down the -Z axis.
// left,right == -x,+x limits of viewing frustum measured in the z=-znear plane
// bot,top == -y,+y limits of viewing frustum measured
// near =- distance from COP to the image-forming plane. 'near' MUST be positive
//         (even though the image-forming plane is at z = -near)

  // UNTESTED!!!
  this.iLeft = left;
  this.iRight = right;
  this.iBot = bot;
  this.iTop = top;
  this.iNear = near;
}

CCamera.prototype.rayPerspective = function(fovy, aspect, zNear) {
//==============================================================================
// Set the camera's viewing frustum with the same arguments used by the OpenGL
// 'gluPerspective()' function
// (except this function has no 'far' argument; not needed for ray-tracing).
//  fovy == vertical field-of-view (bottom-to-top) in degrees
//  aspect ratio == camera image width/height
//  zNear == distance from COP to the image-forming plane. zNear MUST be >0.
  // UNTESTED!!!
  this.iNear = zNear;
  this.iTop = zNear * Math.tan(0.5*fovy*(Math.PI/180.0)); // tan(radians)
  this.iBot = -this.iTop;
  this.iRight = this.iTop*aspect;
  this.iLeft = -this.iRight;
}

CCamera.prototype.raylookAt = function(eyePt, aimPt, upVec) {
//==============================================================================
// Adjust the orientation and position of this ray-tracing camera 
// in 'world' coordinate system.
// Results should exactly match WebGL camera posed by the same arguments.
//
// Each argument (eyePt, aimPt, upVec) is a glMatrix 'vec3' object.
  // UNTESTED!!!
  console.log(eyePt, aimPt, this.nAxis);
  vec3.subtract(this.nAxis, eyePt, aimPt);  // aim-eye == MINUS N-axis direction
  vec3.normalize(this.nAxis, this.nAxis);   // N-axis must have unit length.
  vec3.cross(this.uAxis, upVec, this.nAxis);  // U-axis == upVec cross N-axis
  vec3.normalize(this.uAxis, this.uAxis);   // make it unit-length.
  vec3.cross(this.vAxis, this.nAxis, this.uAxis); // V-axis == N-axis cross U-axis
}

CCamera.prototype.setEyeRay = function(myeRay, xpos, ypos) {
//=============================================================================
// Convert image-plane location (xpos,ypos) in the camera's U,V,N coords:
var posU = this.iLeft + xpos*this.ufrac; 	// U coord,
var posV = this.iBot  + ypos*this.vfrac;	// V coord,
//  and the N coord is always -1, at the image-plane (zNear) position.
// Then convert this point location to world-space X,Y,Z coords using our 
// camera's unit-length coordinate axes uAxis,vAxis,nAxis
 xyzPos = vec4.create();    // make vector 0,0,0,0.	
	vec4.scaleAndAdd(xyzPos, xyzPos, this.uAxis, posU); // xyzPos += Uaxis*posU;
	vec4.scaleAndAdd(xyzPos, xyzPos, this.vAxis, posV); // xyzPos += Vaxis*posU;
  vec4.scaleAndAdd(xyzPos, xyzPos, this.nAxis, -this.iNear); 
  // 																								xyzPos += Naxis * (-1)
  // The eyeRay we want consists of just 2 world-space values:
  //  	-- the ray origin == camera origin == eyePt in XYZ coords
  //		-- the ray direction TO image-plane point FROM ray origin;
  //				myeRay.dir = (xyzPos + eyePt) - eyePt = xyzPos; thus
	vec4.copy(myeRay.orig, this.eyePt);	
	//vec4.copy(myeRay.dir, xyzPos);
	myeRay.dir = vec4.fromValues(xyzPos[0], xyzPos[1], xyzPos[2], 0);
	
	//myeRay.printMe();
}

CCamera.prototype.printMe = function() {
//==============================================================================
// print CCamera object's current contents in console window:
	  console.log("you called CCamera.printMe()");
	  //
	  //
	  // YOU WRITE THIS (see CRay.prototype.printMe() function above)
	  //
	  //
}

//=============================================================================
// Allowable values for CGeom.shapeType variable.  Add some of your own!
//****SHAPE TYPES
const SHAPE_PLANE = 0;    // An endless 'ground plane' surface.
const SHAPE_DISK = 1;
const SHAPE_SPHERE = 2;
const SHAPE_CUBE = 3;

//*****MATERIAL TYPES
const MAT_GRID = 0;
const MAT_GRID_3D = 1;
const MAT_SOLID = 2;
const MAT_CHECKER = 3;

function CGeom(shapeSelect, shapeMat) {
//=============================================================================

	if(shapeSelect == undefined) shapeSelect = SHAPE_PLANE;	// default
	this.shapeType = shapeSelect;
	
	if(shapeMat == undefined) shapeMat = MAT_GRID;
	this.shapeMaterial = shapeMat;
	
	//Transform in the scene buolder (WebGL side)
	this.world2model = mat4.create();	// the matrix used to transform rays from
	                                  // 'world' coord system to 'model' coords;
	                                  // Use this to set shape size, position,
	                                  // orientation, and squash/stretch amount.
	this.inverseMatrix = mat4.create();
	
	this.normalMatrix = mat4.create();
									  
									  
	// Ground-plane 'Line-grid' parameters:
	this.zGrid = 0.0;	// create line-grid on the unbounded plane at z=zGrid
	this.xgap = 1.0;	// line-to-line spacing
	this.ygap = 1.0;
	this.zgap = 1.0;
	this.radius = 1.0;
	this.textureRadius = 1.0;
	
	this.lineWidth = 0.1;	// fraction of xgap used for grid-line width\
	

	this.Mat1 = new Material();
	this.Mat2 = new Material();
	//this.Color1 = vec4.fromValues(0.1,0.5,0.1,1.0);  // RGBA green(A==opacity)
	//this.Color2 = vec4.fromValues( 0.9,0.9,0.9,1.0);  // near-white
	this.skyColor = vec4.fromValues( 0.3,1.0,1.0,1.0);  // cyan/bright blue
	// (use skyColor when ray does not hit anything, not even the ground-plane)
}

CGeom.prototype.findHitPoint = function(outHitList, inHitList, inRay, shadow, second){
	//Conditional on shapetype for all trace grid functions (return CHit object)
	
	outHitList = inHitList;
	
	var inverseOrigin = vec4.create(); var inverseDirection = vec4.create();
	vec4.transformMat4(inverseOrigin, inRay.orig, this.inverseMatrix);
	vec4.transformMat4(inverseDirection, inRay.dir, this.inverseMatrix);
	
	
	
	var modRay = new CRay();
	modRay.dir = inverseDirection;
	modRay.orig =  inverseOrigin;
	
	if(second){
		console.log(this.inverseMatrix);
		inRay.printMe();
		modRay.printMe();
		
	}
	
	switch(this.shapeType){
		case SHAPE_PLANE:
		
			
			var t0 = (this.zGrid -modRay.orig[2])/modRay.dir[2];  //Change Z grid to 0
			
			if(shadow == true){
				//console.log("T: " + t0);
				//console.log(g_currentScene.RAY_EPSILON);
			}
			if(t0< g_currentScene.RAY_EPSILON){
				break;
			}
			var hit = new CHit();
			
			hit.HitPt = vec4.fromValues(	modRay.orig[0] + modRay.dir[0]*t0,
											modRay.orig[1] + modRay.dir[1]*t0,
											this.zGrid, 1.0);
			//console.log("HITPOINT: " + hit.HitPt[0] + ", " + hit.HitPt[1] + ", " + hit.HitPt[2] + ", "  );
			hit.CGeom = this;
			hit.tHit = t0;
			var normal = vec4.fromValues(0,0,1,1);
			vec4.transformMat4(hit.wNormal, normal, this.normalMatrix);
			hit.entry = 0;
			
			outHitList = inHitList.items.push(hit);
			
			
			break;
			
		case SHAPE_DISK:
			var t0 = (this.zGrid -modRay.orig[2])/modRay.dir[2];  //Change Z grid to 0
			var r = 0;
			if(t0< g_currentScene.RAY_EPSILON){
				break;
			}
			var hit = new CHit();
			
			hit.HitPt = vec4.fromValues(	modRay.orig[0] + modRay.dir[0]*t0,
											modRay.orig[1] + modRay.dir[1]*t0,
											this.zGrid, 1.0);
			//console.log("HITPOINT: " + hit.HitPt[0] + ", " + hit.HitPt[1] + ", " + hit.HitPt[2] + ", "  );
			var r2 = hit.HitPt[0]**2 + hit.HitPt[1]**2;
			if(r2 < this.radius**2){
				hit.CGeom = this;
				hit.tHit = t0;
				var normal = vec4.fromValues(0,0,1,1);
				vec4.transformMat4(hit.wNormal, normal, this.normalMatrix);
				hit.entry = 0;
				
				outHitList = inHitList.items.push(hit);
			}
			break;
		
		case SHAPE_SPHERE:
		
			var r2s = vec4.create();
			var zero = vec4.fromValues(0,0,0,1);
			vec4.scaleAndAdd(r2s, zero, modRay.orig, -1);
			var L2 = vec4.dot(r2s, r2s);
			//If we are outside the 
			
			
			var tcaS = vec4.dot(r2s, modRay.dir); // tca *  DL
			
			//Check if the sphere is behind the camera
			if(tcaS < g_currentScene.RAY_EPSILON){
				break;
			}
			
			var DL2 = vec4.dot(modRay.dir, modRay.dir);
			var tca2 = tcaS**2/DL2;
			var LM2 = L2-tca2;
			
			if(LM2 > this.radius**2){
				break;
			}
			
			var shortEdge2 = this.radius**2 - LM2;
			
			
			if(L2 > this.radius**2){
				var firstHit = new CHit();
				var t = tcaS/DL2 - Math.sqrt(shortEdge2/DL2);
				firstHit.tHit = t;
				firstHit.CGeom = this;
				firstHit.HitPt = vec4.create();
				vec4.scaleAndAdd(firstHit.HitPt, modRay.orig, modRay.dir,  t);
				vec4.transformMat4(firstHit.wNormal, firstHit.HitPt, this.normalMatrix);
				firstHit.entry = 1;
				
				outHitList = outHitList.items.push(firstHit);
				if(shadow){return;}
			}
			else{
				var secondHit = new CHit();
				var t = tcaS/DL2 - Math.sqrt(shortEdge2/DL2);
				secondHit.tHit = t;
				secondHit.CGeom = this;
				secondHit.HitPt = vec4.create();
				vec4.scaleAndAdd(secondHit.HitPt, modRay.orig, modRay.dir, t);
				vec4.transformMat4(secondHit.wNormal, secondHit.HitPt, this.normalMatrix);
				secondHit.entry = 2;
				
				outHitList = outHitList.items.push(secondHit);
			}
				
			break;
			
		case SHAPE_CUBE:
			
			
			for(var ii = 0; ii<3; ii++){
				for(var jj = 0; jj <  2; jj++){
					var Hit = this.CubeSideHelper(ii, jj, modRay)
					if(Hit){
						outHitList.items.push(Hit);
					}
				}
			}
			break;
	}
	
}	

CGeom.prototype.CubeSideHelper = function(axis, position, ray){
	
	var t0 = (position -ray.orig[axis])/ray.dir[axis];			
	
	
	if(t0 < g_currentScene.RAY_EPSILON){
		return null;
	}
	var x = (axis + 1)%3;
	var y = (axis + 2)%3;
	var HitPt = vec4.create();
	vec4.scaleAndAdd(HitPt, ray.orig, ray.dir, t0);
	
	if(HitPt[x] < 0 || HitPt[x] >1 || HitPt[y] < 0 || HitPt[y] > 1){
		return null;
	}
	
	var Hit = new CHit();
	Hit.tHit = t0;
	Hit.CGeom = this;
	Hit.HitPt = HitPt;
	
	
	var Normal = vec4.create();
	Normal[axis] = -1; 
	vec4.transformMat4(Hit.wNormal, Normal, this.normalMatrix);
	
	return Hit;
}

CImgBuf.prototype.makeRayTracedImage = function() {
//=============================================================================
// TEMPORARY!!!! 
// THIS FUNCTION SHOULD BE A MEMBER OF YOUR CScene OBJECTS(when you make them),
// and NOT a member of CImgBuf OBJECTS!
//
// Create an image by Ray-tracing.   (called when you press 'T' or 't')

//	console.log("You called CImgBuf.makeRayTracedImage!")

  var eyeRay = new CRay();	// the ray we trace from our camera for each pixel
  var myCam = new CCamera();	// the 3D camera that sets eyeRay values
  var rowFrac = 100/this.ySiz;
  
  var items = g_currentScene.items;
  
  var colr = vec4.create();	// floating-point RGBA color value
	console.log("colr obj:", colr);
	var hit = 0;
  var idx = 0;  // CImgBuf array index(i,j) == (j*this.xSiz + i)*this.pixSiz
  var i,j;      // pixel x,y coordinate (origin at lower left; integer values)
  for(j=0; j< this.ySiz; j++) {       // for the j-th row of pixels.
  	for(i=0; i< this.xSiz; i++) {	    // and the i-th pixel on that row,
		
		
		
		colr = GetTracePixel(i,j, myCam, eyeRay);
		
		idx = (j*this.xSiz + i)*this.pixSiz;	// Array index at pixel (i,j) 
	  	this.fBuf[idx   ] = colr[0];	
	  	this.fBuf[idx +1] = colr[1];
	  	this.fBuf[idx +2] = colr[2];
	  	}
		//document.getElementById('progress').innerHTML = "Rendering: " + j*rowFrac +"% complete";
		console.log("Rendering: " + j*rowFrac +"% complete");
  	}
	//document.getElementById('progress').innerHTML = "Rendering: " + j*rowFrac +"% complete";

  this.float2int();		// create integer image from floating-point buffer.
}

function GetTracePixel(x, y, cam, eyeRay){
	
	var totalColor = vec4.create();
	for(j=0; j< g_AAcode; j++) {       // for the j-th row of pixels.
		for(i=0; i< g_AAcode; i++){
			//console.log("X " + x + "Y: " + y);
			
			
			if(!g_isJitter){
				var X = x + i/g_AAcode; 
				var Y = y + j/g_AAcode;
			}
			else{
				var X = x + (i+Math.random())/g_AAcode; 
				var Y = y + (j+Math.random())/g_AAcode;
			}
			cam.setEyeRay(eyeRay, X, Y);						
			
			
			var hitList = new CHitList();
			hitList.items = [];
			
			for(var ii = 0; ii< g_currentScene.items.length; ii++){
				g_currentScene.items[ii].findHitPoint(hitList, hitList, eyeRay);
				
			}
			var nearHit = new CHit();
			nearHit = hitList.getNearest(nearHit);
			//nearHit.printMe();
			
			if(nearHit){
				var colorOut = nearHit.getColor(eyeRay, 0);
				vec4.scaleAndAdd(totalColor, totalColor, colorOut, 1);
			}
			else{
				vec4.scaleAndAdd(totalColor, totalColor, g_clearColor, 1);
			}
		}
	}
	
	if(x%20 == 0 && y%20 == 0){
			//console.log("X: " + i + " Y: " + j);
			hitList.printMe();
	}
	vec4.scale(totalColor, totalColor, 1/g_AAcode**2);
	
	return totalColor;
}

//***********CSCENE******************
function CScene(items) {
//=============================================================================
  this.RAY_EPSILON = 1.0E-15;      
  this.items = items;
  this.lights = [];
  
  for(var i = 0; i< this.items.length; i++){
			mat4.invert(this.items[i].inverseMatrix, this.items[i].world2model);
			mat4.transpose(this.items[i].normalMatrix, this.items[i].inverseMatrix);
	}
}


//**********************CHIT********************************
function CHit() {
//=============================================================================
// Describes one ray/object intersection point that was found by 'tracing' one
// ray through one shape (through a single CGeom object, held in the
// CScene.item[] array).
// CAREFUL! We don't use isolated CHit objects, but instead gather all the CHit
// objects for one ray in one list held inside a CHitList object.
// (CHit, CHitList classes are consistent with the 'HitInfo' and 'Intersection'
// classes described in FS Hill, pg 746).
	this.HitPt;
	this.CGeom;
	this.tHit;
	this.wNormal = vec4.create();
	this.worldHitPt = vec4.create();
	this.entry = 0; //0 -- 0 thichkness, 1 in, 2 out;
}

CHit.prototype.printMe = function(){
	
	
	console.log("CHit: \n T: " + this.tHit + "\n HitPoint: " + this.HitPt[0] + ", " + this.HitPt[1] + ", " + this.HitPt[2]);
}

function CHitList() {
//=============================================================================
	var items = [];
	//console.log("New CHitList, Number of items: " + items.length);
}

CHitList.prototype.printMe = function(){
	
	
	var str = "*CHitList: ";
	str+= this.items.length.toString();
	str+= " Item(s)\n";
	//console.log("New CHitList, Number of items: " + this.items[0]);
	if(this.items.length == 0){
		str += "EMPTY \n";
	}
	for(var i = 0; i < this.items.length; i++){
		
		var hit = this.items[i];
		switch(hit.CGeom.shapeType){
			case SHAPE_PLANE:
				str += "GroundPlane. T = " + hit.tHit.toString() + "\n";
				break;
			case SHAPE_DISK:
				str += "Disk. T = " + hit.tHit.toString() + "\n";
				break;
			case SHAPE_SPHERE:
				str += "Shpere. T = " + hit.tHit.toString() + "\n";
				break;
			case SHAPE_CUBE:
				str += "Cube. T = " + hit.tHit.toString() + "\n";
				break;
			default:
				str += "Unknown Shape. ";
		}
	}
	console.log(str);
}
CHit.prototype.getColor = function(incidentRay, depth){
	//This function gets the color of a shape from the hit Point
	outColor = vec3.fromValues(0,0,0);
	
	
	//console.log("Two");
	var inMaterial;
	var shape = this.CGeom;
	switch(shape.shapeMaterial){
		
		case MAT_GRID:
		
			var x =  this.HitPt[0]*shape.textureRadius;
			var y =  this.HitPt[1]*shape.textureRadius;
			
			
			var loc = x / shape.xgap; 
			if(x < 0) loc = -loc;    // keep >0 to form double-width line at yaxis.
			//console.log("loc",loc, "loc%1", loc%1, "lineWidth", this.lineWidth);
			if(loc%1 < shape.lineWidth) {    // hit a line of constant-x?    // yes.
				inMaterial = shape.Mat1;
				break;
			}
			loc = y / shape.ygap;     // how many 'ygaps' from origin?
			if(y < 0) loc = -loc;    // keep >0 to form double-width line at xaxis.
			if(loc%1 < shape.lineWidth) {   // hit a line of constant-y?      // yes.
				inMaterial = shape.Mat1;
				break;
			}
			inMaterial = shape.Mat2;
			
			break;
		
		case MAT_GRID_3D:
		
			var x =  this.HitPt[0]*shape.textureRadius;
			var y =  this.HitPt[1]*shape.textureRadius;
			var z =  this.HitPt[2]*shape.textureRadius;
			
			var loc = x / shape.xgap; 
			if(this.HitPt[0] < 0) loc = -loc;    // keep >0 to form double-width line at yaxis.
			//console.log("loc",loc, "loc%1", loc%1, "lineWidth", this.lineWidth);
			if(loc%1 < shape.lineWidth) {    // hit a line of constant-x?    // yes.
				inMaterial = shape.Mat1;
				break;
			}
			loc = y / shape.ygap;     // how many 'ygaps' from origin?
			if(this.HitPt[1] < 0) loc = -loc;    // keep >0 to form double-width line at xaxis.
			if(loc%1 < shape.lineWidth) {   // hit a line of constant-y?      // yes.
				inMaterial = shape.Mat1;
				break;
			}
			loc = z / shape.zgap;
			if(this.HitPt[2] < 0) loc = -loc;    // keep >0 to form double-width line at xaxis.
			if(loc%1 < shape.lineWidth) {   // hit a line of constant-y?      // yes.
				inMaterial = shape.Mat1;
				break;
			}
			inMaterial = shape.Mat2;

			break;
		
		
		case MAT_SOLID:
		
			inMaterial = shape.Mat1;
		
			break;
		
		case MAT_CHECKER:
			
			var x = this.HitPt[0]*shape.textureRadius;
			var y = this.HitPt[1]*shape.textureRadius;
			var z = this.HitPt[2]*shape.textureRadius;
			
			var tot = Math.floor(x/shape.xgap) + 
				Math.floor(y/shape.ygap) + 
				Math.floor(z/shape.zgap);
			
			var y = tot%2;
			if(y < 0){ y = -y};
			if(y < 0.5){inMaterial = shape.Mat1;}
			else{inMaterial = shape.Mat2;}
			
			break;

		
			
	}
	//Transmitted rays! (they don't count!)
	if(this.entry == 2){
		if(inMaterial.refraction == -1){
			return vec4.create();
		}
		
	}
	//console.log("Three");
	var outColor = vec4.create();
	var outReflect = vec4.create();
	this.getLighting(outColor, outReflect, inMaterial, incidentRay);
	
	
	//Reflections:
			
	if(g_maxDepth - depth > 0){
		
		var hitList = new CHitList();
		hitList.items = [];
		var rRay = new CRay();
			rRay.orig = this.worldHitPt;
			rRay.dir = outReflect;
		
		var second = false;
		/*
		if(this.CGeom.shapeType == SHAPE_DISK){
			//second = true;
		}
		*/
		for(var ii = 0; ii< g_currentScene.items.length; ii++){
			g_currentScene.items[ii].findHitPoint(hitList, hitList, rRay, false, second);
		}
		
		/*if(this.CGeom.shapeType == SHAPE_DISK){
			console.log("Bounce from the disk: \n" + 
			"HitPoint: " + this.worldHitPt + "\n" +
			"Reflected Ray: " + rRay.dir);
			
			hitList.printMe();
		}*/
		var nearHit = new CHit();
		nearHit = hitList.getNearest(nearHit);
		
		if(nearHit){
			var colorOut = nearHit.getColor(rRay, depth+1);
			var rColor = vec4.create();
			vec4.multiply(rColor, colorOut, inMaterial.K_spec);
			vec4.scaleAndAdd(outColor, outColor, rColor, inMaterial.absorb);
		}
		else{

			var rColor = vec4.create();
			vec4.multiply(rColor, g_clearColor, inMaterial.K_spec);
			vec4.scaleAndAdd(outColor, outColor, rColor, inMaterial.absorb);
		}
	}	
	
	return outColor;
}

CHit.prototype.getLighting = function(out, outReflected, inMaterial, incidentRay){
	
	vec4.transformMat4(this.worldHitPt, this.HitPt, this.CGeom.world2model);
	
	for(var i = 0; i < g_currentScene.lights.length; i++){
		if(g_currentScene.lights[i].isOn){
			var StLRay = new CRay();
			StLRay.orig = this.worldHitPt;
			StLRay.dir = vec4.create();
			
			
			
			vec4.scaleAndAdd(StLRay.dir, g_currentScene.lights[i].position, StLRay.orig, -1);
			
			var hitList = new CHitList();
			hitList.items = [];
			
			for(var ii = 0; ii< g_currentScene.items.length; ii++){
				g_currentScene.items[ii].findHitPoint(hitList, hitList, StLRay, true);
				
			}
			
			var occludingItems = 0;
			for( var ii = 0; ii < hitList.items.length; ii++){
				
				if(hitList.items[ii].tHit <= 1){
					occludingItems++;
					break;
				}
			}
			
			//Calculate the reflecting ray for reflection later
			vec3.normalize(this.wNormal, this.wNormal);
			var IDotN = vec4.dot(incidentRay.dir, this.wNormal);
			vec4.scaleAndAdd(outReflected, incidentRay.dir, this.wNormal, -2*IDotN);
			vec3.normalize(outReflected, outReflected);
			outReflected[3] = 0;
			
			if(occludingItems > 0){
				
				//If the path to the light is occluded only add the ambient term
				
				var ambientTerm = vec4.create();
				ambientTerm = vec4.multiply(ambientTerm, inMaterial.K_ambi, g_currentScene.lights[i].colors.ambi);
				vec4.scaleAndAdd(out, out, ambientTerm, 1);
			}
			else{
				
				//Phong Lighting:
				
				var ambientTerm = vec4.create();
				vec4.multiply(ambientTerm, inMaterial.K_ambi, g_currentScene.lights[i].colors.ambi);
				vec4.scaleAndAdd(out, out, ambientTerm, 1);
				
				var diffuseTerm = vec4.create();
				vec4.multiply(diffuseTerm, inMaterial.K_diff, g_currentScene.lights[i].colors.diff);
				vec3.normalize(StLRay.dir, StLRay.dir);
				
				var diffScale = Math.max(vec4.dot(this.wNormal, StLRay.dir),0);
				vec4.scaleAndAdd(out, out, diffuseTerm, diffScale);

				var specTerm = vec4.create();
				vec4.multiply(specTerm, inMaterial.K_spec, g_currentScene.lights[i].colors.spec);

				var specScale = Math.max(vec4.dot(outReflected, StLRay.dir),0)**inMaterial.K_shiny;
				vec4.scaleAndAdd(out, out, specTerm, specScale);
			}
		}
	}
}	

CHitList.prototype.getNearest = function(outHit){
	
	var nearestT = 10000;
	var hit  = null;
	
	for(var i = 0; i < this.items.length; i++){
		
		if(this.items[i].tHit < nearestT){
			
			
			hit = this.items[i];
			
			nearestT = this.items[i].tHit;
		}
	}
	outHit = hit;
	return outHit;
}

//************************CIMAGE BUFF*******************************

function CImgBuf(wide, tall) {
//=============================================================================


	this.xSiz = wide;							// image width in pixels
	this.ySiz =	tall;							// image height in pixels
	this.pixSiz = 3;							// pixel size (3 for RGB, 4 for RGBA, etc)
	this.iBuf = new Uint8Array(  this.xSiz * this.ySiz * this.pixSiz);	
	this.fBuf = new Float32Array(this.xSiz * this.ySiz * this.pixSiz);
}



CImgBuf.prototype.setTestPattern = function(pattNum) {
//=============================================================================
var PATT_MAX = 4;       // number of patterns we can draw:
  if(pattNum < 0 || pattNum >= PATT_MAX) 
    pattNum %= PATT_MAX; // prevent out-of-range inputs.
//console.log('pattNum: ', pattNum);

  // use local vars to set the array's contents.
  for(var j=0; j< this.ySiz; j++) {						// for the j-th row of pixels
  	for(var i=0; i< this.xSiz; i++) {					//  & the i-th pixel on that row,
	  	var idx = (j*this.xSiz + i)*this.pixSiz;// Array index at pixel (i,j) 
	  	switch(pattNum) {
	  		case 0:	//================(Colorful L-shape)===========================
			  	if(i < this.xSiz/4 || j < this.ySiz/4) {
			  		this.iBuf[idx   ] = i;								// 0 <= red <= 255
			  		this.iBuf[idx +1] = j;								// 0 <= grn <= 255
			  	}
			  	else {
			  		this.iBuf[idx   ] = 0;
			  		this.iBuf[idx +1] = 0;
			  		}
			  	this.iBuf[idx +2] = 255 -i -j;								// 0 <= blu <= 255
			  	break;
			  case 1: //================(bright orange)==============================
			  	this.iBuf[idx   ] = 255;	// bright orange
			  	this.iBuf[idx +1] = 128;
			  	this.iBuf[idx +2] =   0;
	  			break;
	  		case 2: //=================(Vertical Blue/yellow)=======================
    	  	if(i > 5 * this.xSiz/7 && j > 4*this.ySiz/5) {
    	  		this.iBuf[idx   ] = 200;                // 0 <= red <= 255
    	  		this.iBuf[idx +1] = 200;								// 0 <= grn <= 255
    	  	  this.iBuf[idx +2] = 200;								// 0 <= blu <= 255
    	  	}
    	  	else {
    	  		this.iBuf[idx   ] = 255-j;                // 0 <= red <= 255
    	  		this.iBuf[idx +1] = 255-j;	 							  // 0 <= grn <= 255
    	  	  this.iBuf[idx +2] = j;								// 0 <= blu <= 255
    	  	}
    	  	break;
    	  case 3: 
    	    //================(Diagonal YRed/Cyan)================================
			  	this.iBuf[idx   ] = 255 - (i+j)/2;	// bright orange
			  	this.iBuf[idx +1] = 255 - j;
			  	this.iBuf[idx +2] = 255 - j;
    	    break;
	  		default:
	  			console.log("CImgBuf.setTestPattern() says: WHUT!?");
	  		break;
	  	}
  	}
  }
  this.int2float();		// fill the floating-point buffer with same test pattern.
}




CImgBuf.prototype.int2float = function() {
//=============================================================================
// Convert the integer RGB image in iBuf into floating-point RGB image in fBuf
for(var j=0; j< this.ySiz; j++) {		// for each scanline
  	for(var i=0; i< this.xSiz; i++) {		// for each pixel on that scanline
  		var idx = (j*this.xSiz + i)*this.pixSiz;// Find array index @ pixel (i,j)
			// convert integer 0 <= RGB <= 255 to floating point 0.0 <= R,G,B <= 1.0
  		this.fBuf[idx   ] = this.iBuf[idx   ] / 255.0;	// red
  		this.fBuf[idx +1] = this.iBuf[idx +1] / 255.0;	// grn
  		this.fBuf[idx +2] = this.iBuf[idx +2] / 255.0;	// blu  		
  	}
  }
}

CImgBuf.prototype.float2int = function() {
//=============================================================================
// Convert the floating-point RGB image in fBuf into integer RGB image in iBuf
for(var j=0; j< this.ySiz; j++) {		// for each scanline,
  	for(var i=0; i< this.xSiz; i++) {	 // for each pixel on that scanline,
  		var idx = (j*this.xSiz + i)*this.pixSiz; //Find array index @ pixel(i,j):
			// find 'clamped' color values that stay >=0.0 and <=1.0:
  		var rval = Math.min(1.0, Math.max(0.0, this.fBuf[idx   ]));
  		var gval = Math.min(1.0, Math.max(0.0, this.fBuf[idx +1]));
  		var bval = Math.min(1.0, Math.max(0.0, this.fBuf[idx +2]));
			// Divide [0,1] span into 256 equal-sized parts:  Math.floor(rval*256)
			// In the rare case when rval==1.0 you get unwanted '256' result that 
			// won't fit into the 8-bit RGB values.  Fix it with Math.min():
  		this.iBuf[idx   ] = Math.min(255,Math.floor(rval*256.0));	// red
  		this.iBuf[idx +1] = Math.min(255,Math.floor(gval*256.0));	// grn
  		this.iBuf[idx +2] = Math.min(255,Math.floor(bval*256.0));	// blu
  	}
  }
}

CImgBuf.prototype.printPixAt = function(xpix,ypix) {
//=============================================================================
// Use console.log() to print the integer and floating-point values (R,B,B,...)
// stored in our CImgBuf object for the pixel at (xpix,ypix)
		//
		//
		//		YOU WRITE THIS
		//
		//
}