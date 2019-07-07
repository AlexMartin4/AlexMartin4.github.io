const PART_XPOS     = 0;  //  position    
const PART_YPOS     = 1;
const PART_ZPOS     = 2;
const PART_WPOS     = 3;            // (why include w? for matrix transforms; 
                                    // for vector/point distinction
const PART_XVEL     = 4;  //  velocity -- ALWAYS a vector: x,y,z; no w. (w==0)    
const PART_YVEL     = 5;
const PART_ZVEL     = 6;
const PART_X_FTOT   = 7;  // force accumulator:'ApplyForces()' fcn clears
const PART_Y_FTOT   = 8;  // to zero, then adds each force to each particle.
const PART_Z_FTOT   = 9;        
const PART_R        =10;  // color : red,green,blue, alpha (opacity); 0<=RGBA<=1.0
const PART_G        =11;  
const PART_B        =12;
const PART_MASS     =13;  // mass   
const PART_DIAM 	  =14;	// on-screen diameter (in pixels)
const PART_RENDMODE =15;	// on-screen appearance (square, round, or soft-round)
const PART_AGE      =16;  // # of frame-times since creation/initialization
const PART_CHARGE   =17;  // for electrostatic repulsion/attraction
/*
const PART_MASS_VEL =18;  // time-rate-of-change of mass.
const PART_MASS_FTOT=19;  // force-accumulator for mass-change
const PART_R_VEL    =20;  // time-rate-of-change of color:red
const PART_G_VEL    =21;  // time-rate-of-change of color:grn
const PART_B_VEL    =22;  // time-rate-of-change of color:blu
const PART_R_FTOT   =23;  // force-accumulator for color-change: red
const PART_G_FTOT   =24;  // force-accumulator for color-change: grn
const PART_B_FTOT   =25;  // force-accumulator for color-change: blu
*/
const PART_MAXVAR   =18;  // Size of array in CPart uses to store its values.


// Array-Name consts that select PartSys objects' numerical-integration solver:
//------------------------------------------------------------------------------
// EXPLICIT methods: GOOD!
//    ++ simple, easy to understand, fast, but
//    -- Requires tiny time-steps for stable stiff systems, because
//    -- Errors tend to 'add energy' to any dynamical system, driving
//        many systems to instability even with small time-steps.
const SOLV_EULER       = 0;       // Euler integration: forward,explicit,...
const SOLV_MIDPOINT    = 1;       // Midpoint Method (see Pixar Tutorial)
const SOLV_ADAMS_BASH  = 2;       // Adams-Bashforth Explicit Integrator
const SOLV_RUNGEKUTTA  = 3;       // Arbitrary degree, set by 'solvDegree'

// IMPLICIT methods:  BETTER!
//          ++Permits larger time-steps for stiff systems, but
//          --More complicated, slower, less intuitively obvious,
//          ++Errors tend to 'remove energy' (ghost friction; 'damping') that
//              aids stability even for large time-steps.
//          --requires root-finding (iterative: often no analytical soln exists)
const SOLV_BACK_EULER  = 4;      // 'Backwind' or Implicit Euler
const SOLV_BACK_MIDPT  = 5;      // 'Backwind' or Implicit Midpoint
const SOLV_BACK_ADBASH = 6;    // 'Backwind' or Implicit Adams-Bashforth
// OR SEMI-IMPLICIT METHODS: BEST?
//          --Permits larger time-steps for stiff systems,
//          ++Simpler, easier-to-understand than Implicit methods
//          ++Errors tend to 'remove energy) (ghost friction; 'damping') that
//              aids stability even for large time-steps.
//          ++ DOES NOT require the root-finding of implicit methods,
const SOLV_VERLET      = 6;       // Verlet semi-implicit integrator;
const SOLV_VEL_VERLET  = 7;       // 'Velocity-Verlet'semi-implicit integrator
const SOLV_LEAPFROG    = 8;       // 'Leapfrog' integrator
const SOLV_MAX         = 9;       // number of solver types available.

const NU_EPSILON  = 10E-15;           // tiny amount; a minimum vector length
                                    // to use to avoid 'divide-by-zero'

//=============================================================================
//=============================================================================
function PartSys() {
//==============================================================================
//=============================================================================

	this.age = 0;
}




PartSys.prototype.initBouncy3D = function(count) { 
//==============================================================================
  console.log('PartSys.initBouncy3D() stub not finished!');
}

PartSys.prototype.initFireReeves = function(count) {
//==============================================================================
  console.log('PartSys.initFireReeves() stub not finished!');
}

PartSys.prototype.initFlocking = function(count) { 
//==============================================================================
  console.log('PartSys.initFlocking() stub not finished!');
}
PartSys.prototype.initSpringPair = function() { 
//==============================================================================
  console.log('PartSys.initSpringPair() stub not finished!');
}
PartSys.prototype.initSpringRope = function(count) { 
//==============================================================================
  console.log('PartSys.initSpringRope() stub not finished!');
}
PartSys.prototype.initSpringCloth = function(xSiz,ySiz) {
//==============================================================================
  console.log('PartSys.initSpringCloth() stub not finished!');
}
PartSys.prototype.initSpringSolid = function() {
//==============================================================================
  console.log('PartSys.initSpringSolid() stub not finished!');
}
PartSys.prototype.initOrbits = function() {
//==============================================================================
  console.log('PartSys.initOrbits() stub not finished!');
}

PartSys.prototype.applyForces = function(s, fSet) { 
//==============================================================================
// Clear the force-accumulator vector for each particle in state-vector 's', 
// then apply each force described in the collection of force-applying objects 
// found in 'fSet'.
// (this function will simplify our too-complicated 'draw()' function)
	
	
	var j = 0;
		for(j = 0; j < this.partCount*PART_MAXVAR; j += PART_MAXVAR){
			//FIRST WE WIPE
			s[PART_X_FTOT + j] = 0;
			s[PART_Y_FTOT + j] = 0;
			s[PART_Z_FTOT + j] = 0;
			
			//PLACEHOLDER FORCES
			/*this.s0[PART_Y_FTOT + j] += -9.81*this.s0[PART_MASS+j];
			this.s0[PART_Y_FTOT + j] -= this.s0[PART_YVEL + j]*2;
			this.s0[PART_X_FTOT + j] -= this.s0[PART_XVEL + j]*2*/
	}
	
	var i = 0;
	for(i = 0; i < this.forceCount*CFORCER_MAXVAR; i+= CFORCER_MAXVAR){
		

		switch(fSet[i + CFORCER_TYPE]){
			
			case CFORCER_2END_SPRING:
				//console.log("Applying spring potential");
				//Force exerted by a damped spring: Fx = +k(Dx - lr) -cv
				var Aoffset = (fSet[i+CFORCER_A])*PART_MAXVAR;
				var Boffset = (fSet[i+CFORCER_B])*PART_MAXVAR;
				//SPRING RESTORING FORCE
				AtoBX = s[PART_XPOS + Boffset] -  s[PART_XPOS + Aoffset];
				AtoBY = s[PART_YPOS + Boffset] -  s[PART_YPOS + Aoffset];
				AtoBZ = s[PART_ZPOS + Boffset] -  s[PART_ZPOS + Aoffset];
									
				lengthAB = Math.sqrt(AtoBX*AtoBX + AtoBY*AtoBY + AtoBZ*AtoBZ);

				lengthDiff = lengthAB - fSet[i + CFORCER_R_LENGTH];
				//console.log("Dx: " + lengthDiff);				
				
				if(lengthAB == 0){ lengthAB = 0.001}
				
				AtoBX = AtoBX/lengthAB;
				AtoBY = AtoBY/lengthAB;
				AtoBZ = AtoBZ/lengthAB;
				
				mag = lengthDiff * fSet[i + CFORCER_K_CONST];
				
				s[PART_X_FTOT + Aoffset] += AtoBX*mag;
				s[PART_Y_FTOT + Aoffset] += AtoBY*mag;
				s[PART_Z_FTOT + Aoffset] += AtoBZ*mag;

				
				s[PART_X_FTOT + Boffset] -= AtoBX*mag;
				s[PART_Y_FTOT + Boffset] -= AtoBY*mag;
				s[PART_Z_FTOT + Boffset] -= AtoBZ*mag;
				
				//SPRING DAMPING FORCE
				//
				VelAtoBX = s[PART_XVEL + Boffset] -  s[PART_XVEL + Aoffset];
				VelAtoBY = s[PART_YVEL + Boffset] -  s[PART_YVEL + Aoffset];
				VelAtoBZ = s[PART_ZVEL + Boffset] -  s[PART_ZVEL + Aoffset];
									
				DvAB = Math.sqrt(VelAtoBX*VelAtoBX + VelAtoBY*VelAtoBY + VelAtoBZ*VelAtoBZ);
				
				if(DvAB !=0){
				
					VelAtoBX = VelAtoBX/DvAB;
					VelAtoBY = VelAtoBY/DvAB;
					VelAtoBZ = VelAtoBZ/DvAB;
					
					
					mag = DvAB * fSet[i + CFORCER_DAMPING];
					
					s[PART_X_FTOT + Aoffset] -= VelAtoBX*mag;
					s[PART_Y_FTOT + Aoffset] -= VelAtoBY*mag;
					s[PART_Z_FTOT + Aoffset] -= VelAtoBZ*mag;
													   
					s[PART_X_FTOT + Boffset] += VelAtoBX*mag;
					s[PART_Y_FTOT + Boffset] += VelAtoBY*mag;
					s[PART_Z_FTOT + Boffset] += VelAtoBZ*mag;
				
				}
				break;
			
			case CFORCER_CONSTANT_FIELD:
				
				//console.log("Applying Gravity");
				var j = 0;
				for(j = 0; j < this.partCount*PART_MAXVAR; j += PART_MAXVAR){
					
					s[PART_X_FTOT + j] += fSet[i + CFORCER_X]*fSet[i + CFORCER_FIELD_CONST];
					s[PART_Y_FTOT + j] += fSet[i + CFORCER_Y]*fSet[i + CFORCER_FIELD_CONST];
					s[PART_Z_FTOT + j] += fSet[i + CFORCER_Z]*fSet[i + CFORCER_FIELD_CONST];
				}
				
				break;
			
			case CFORCER_DRAG:
			
				//console.log("Applying drag");
				var j = 0;
				for(j = 0; j < this.partCount*PART_MAXVAR; j += PART_MAXVAR){
					
					s[PART_X_FTOT + j] -= s[PART_XVEL + j]*fSet[i + CFORCER_DAMPING];
					s[PART_Y_FTOT + j] -= s[PART_YVEL + j]*fSet[i + CFORCER_DAMPING];
					s[PART_Z_FTOT + j] -= s[PART_ZVEL + j]*fSet[i + CFORCER_DAMPING];

				}
				
				break;
				
			case CFORCER_TORNADO:
			
				var j=0;
				for(j = 0; j < this.partCount*PART_MAXVAR; j += PART_MAXVAR){
					
					var r = Math.sqrt(s[PART_XPOS + j]*s[PART_XPOS+ j] + s[PART_YPOS + j]*s[PART_YPOS+ j]);
					var factor = fSet[i + CFORCER_MAXFORCE]*Math.exp(-r/fSet[i + CFORCER_TAU]);
					
					var normX = s[PART_XPOS + j]/r;
					var normY = s[PART_YPOS + j]/r;
					
					s[PART_X_FTOT + j] += normY*factor;
					s[PART_Y_FTOT + j] += -normX*factor;
					s[PART_Z_FTOT + j] += fSet[i + CFORCER_UPDRAFT]*factor;
					
					//Indraft
					s[PART_X_FTOT + j] += -normX*fSet[i + CFORCER_INDRAFT];
					s[PART_Y_FTOT + j] += -normY*fSet[i + CFORCER_INDRAFT];
				}
				
				break;
				
			case CFORCER_WIND:
				
				var j=0;
				
				if(this.age - this.lastWind > fSet[i + CFORCER_TAU]){
					this.lastWind = this.age;
					var DeltaF = fSet[i + CFORCER_MAXFORCE] - fSet[i + CFORCER_FIELD_CONST];
					
					this.windForce = fSet[i + CFORCER_FIELD_CONST] + Math.random()*DeltaF;
					console.log("Wind: " + this.windForce);
				}
				
					
				var sigma  = 1.0;
				var t = this.age - this.lastWind;
				var b = fSet[i + CFORCER_TAU]/2;
				var mag = this.windForce/sigma*Math.exp(-Math.pow(t-b, 2)/(2*Math.pow(sigma,2)));
				//console.log("Wind Mag: " + mag);
					
				for(j = 0; j < this.partCount*PART_MAXVAR; j += PART_MAXVAR){	
					s[PART_X_FTOT + j] += mag*fSet[i + CFORCER_X];
					s[PART_Y_FTOT + j] += mag*fSet[i + CFORCER_Y];
					s[PART_Z_FTOT + j] += mag*fSet[i + CFORCER_Z];
				}
				
				
				break;
				
			case CFORCER_B_SEPARATION:
			
				for(var ii = this.outside*PART_MAXVAR; ii<this.partCount*PART_MAXVAR; ii+=PART_MAXVAR){
					
					
					for(var j = ii+PART_MAXVAR ; j<this.partCount*PART_MAXVAR; j+=PART_MAXVAR){
						
						//console.log(j);
						var ItoJX = s[PART_XPOS + j] - s[PART_XPOS + ii];
						var ItoJY = s[PART_YPOS + j] - s[PART_YPOS + ii];
						var ItoJZ = s[PART_ZPOS + j] - s[PART_ZPOS + ii];
						
						var dist2 = Math.pow(ItoJX,2) + Math.pow(ItoJY,2) + Math.pow(ItoJZ,2);
						if(dist2 < 0.1){dist2 = 0.1;}
						
						var mag = fSet[CFORCER_MAXFORCE + i]/dist2;
						
						
						ItoJX = ItoJX/Math.sqrt(dist2);
						ItoJY = ItoJY/Math.sqrt(dist2);
						ItoJZ = ItoJZ/Math.sqrt(dist2);
						
						s[PART_X_FTOT + ii] += -mag*ItoJX;
						s[PART_Y_FTOT + ii] += -mag*ItoJY;
						s[PART_Z_FTOT + ii] += -mag*ItoJZ;
						
						//console.log("Mag Repulsion: " + mag);
						
						s[PART_X_FTOT + j] += mag*ItoJX;
						s[PART_Y_FTOT + j] += mag*ItoJY;
						s[PART_Z_FTOT + j] += mag*ItoJZ;
					}
				}
			
			break;
			
			case CFORCER_B_COHESION:
				
				var Cx = 0;
				var Cy = 0;
				var Cz = 0;
				
				for(var j = this.outside*PART_MAXVAR; j<this.partCount*PART_MAXVAR; j+=PART_MAXVAR){
				
					Cx += s[PART_XPOS + j];
					Cy += s[PART_YPOS + j];
					Cz += s[PART_ZPOS + j];
				
				}
				
				Cx = Cx/(this.partCount-this.outside);
				Cy = Cy/(this.partCount-this.outside);
				Cz = Cz/(this.partCount-this.outside);
				
				for(var j = this.outside*PART_MAXVAR; j<this.partCount*PART_MAXVAR; j+=PART_MAXVAR){
					
					
					var CtoJX = s[PART_XPOS + j] - Cx;
					var CtoJY = s[PART_YPOS + j] - Cy;
					var CtoJZ = s[PART_ZPOS + j] - Cz;
					
					var dist2 = Math.pow(CtoJX,2) + Math.pow(CtoJY,2) + Math.pow(CtoJZ,2);
					if(dist2 < 0.1){dist2 = 0.1;}
					
					var mag = fSet[CFORCER_MAXFORCE + i];
					//console.log("Mag: " + mag)
						
					CtoJX = CtoJX/Math.sqrt(dist2);
					CtoJY = CtoJY/Math.sqrt(dist2);
					CtoJZ = CtoJZ/Math.sqrt(dist2);
					
					//console.log("i = " + j/PART_MAXVAR + " X: " + CtoJX + " Y: " + CtoJY + " Z: " +CtoJZ );
					
					s[PART_X_FTOT + j] -= mag*CtoJX;
					s[PART_Y_FTOT + j] -= mag*CtoJY;
					s[PART_Z_FTOT + j] -= mag*CtoJZ;
				}
			
			break;
			
			case CFORCER_B_ALIGNMENT:
				
				var Vx = 0;
				var Vy = 0;
				var Vz = 0;
				
				for(var j = this.outside*PART_MAXVAR; j<this.partCount*PART_MAXVAR; j+=PART_MAXVAR){
				
					Vx += s[PART_XVEL + j];
					Vy += s[PART_YVEL + j];
					Vz += s[PART_ZVEL + j];
				
				}
				
				Vx = Vx/(this.partCount - this.outside);
				Vy = Vy/(this.partCount - this.outside);
				Vz = Vz/(this.partCount - this.outside);
				
				for(var j = this.outside*PART_MAXVAR; j<this.partCount*PART_MAXVAR; j+=PART_MAXVAR){
					
					var VDiffX = s[PART_XVEL + j] - Vx;
					var VDiffY = s[PART_YVEL + j] - Vy;
					var VDiffZ = s[PART_ZVEL + j] - Vz;
					
					var mag = fSet[CFORCER_MAXFORCE + i];

					s[PART_X_FTOT + j] += mag*VDiffX;
					s[PART_Y_FTOT + j] += mag*VDiffY;
					s[PART_Z_FTOT + j] += mag*VDiffZ;
				}                      
			
			break;
			
			case CFORCER_B_OUTSIDE:
				

				for(var ii = 0; ii<this.outside*PART_MAXVAR; ii+=PART_MAXVAR){
				
				
					for(var j = this.outside*PART_MAXVAR; j<this.partCount*PART_MAXVAR; j+=PART_MAXVAR){
						
						
						var CtoJX = s[PART_XPOS + j] - s[PART_XPOS + ii];
						var CtoJY = s[PART_YPOS + j] - s[PART_YPOS + ii];
						var CtoJZ = s[PART_ZPOS + j] - s[PART_ZPOS + ii];
						
						var dist2 = Math.pow(CtoJX,2) + Math.pow(CtoJY,2) + Math.pow(CtoJZ,2);
						if(dist2 < 0.1){dist2 = 0.1;}
						
						var mag = fSet[CFORCER_MAXFORCE + i]*s[ii + PART_CHARGE];
						//console.log("Mag: " + mag)
							
						CtoJX = CtoJX/Math.sqrt(dist2);
						CtoJY = CtoJY/Math.sqrt(dist2);
						CtoJZ = CtoJZ/Math.sqrt(dist2);
						
						//console.log("i = " + j/PART_MAXVAR + " X: " + CtoJX + " Y: " + CtoJY + " Z: " +CtoJZ );
						
						s[PART_X_FTOT + j] -= mag*CtoJX;
						s[PART_Y_FTOT + j] -= mag*CtoJY;
						s[PART_Z_FTOT + j] -= mag*CtoJZ;
					}
				}
			
			break;
			
			default:
				console.log("CForcer type not recognised!");
		}
		
		
	}
}

PartSys.prototype.dotFinder = function(src, dest) {
//==============================================================================
	for(var j = 0; j < this.partCount*PART_MAXVAR; j+= PART_MAXVAR) {
		 dest[j+ PART_XPOS] = src[j + PART_XVEL];
		 dest[j + PART_YPOS] = src[j + PART_YVEL];
		 dest[j + PART_ZPOS] = src[j + PART_ZVEL];
		 dest[j + PART_WPOS] = 0;
		 
		 dest[j + PART_XVEL] = src[j + PART_X_FTOT]/src[j + PART_MASS];
		 dest[j + PART_YVEL] = src[j + PART_Y_FTOT]/src[j + PART_MASS];
		 dest[j + PART_ZVEL] = src[j + PART_Z_FTOT]/src[j + PART_MASS];
		 
		 dest[j + PART_X_FTOT] = 0;
		 dest[j + PART_Y_FTOT] = 0;
		 dest[j + PART_Z_FTOT] = 0;
		 
		 dest[j + PART_R] = 0;
		 dest[j + PART_G] = 0;
		 dest[j + PART_B] = 0;
		 
		 dest[j + PART_MASS] = 0;
		 dest[j + PART_DIAM] = 0;
		 
		 dest[j + PART_AGE] = 1;
		 
		 dest[j + PART_RENDMODE] = 0;
	}

}
PartSys.prototype.dotFinder2 = function(src, dest) {
//==============================================================================
	for(var j = 0; j < this.partCount*PART_MAXVAR; j+= PART_MAXVAR) {
		 dest[j+ PART_XPOS] =  src[j + PART_X_FTOT]/src[j + PART_MASS];
		 dest[j + PART_YPOS] = src[j + PART_Y_FTOT]/src[j + PART_MASS];
		 dest[j + PART_ZPOS] = src[j + PART_Z_FTOT]/src[j + PART_MASS];
		 dest[j + PART_WPOS] = 0;
		 
		 dest[j + PART_XVEL] = 0;
		 dest[j + PART_YVEL] = 0;
		 dest[j + PART_ZVEL] = 0;
		 
		 dest[j + PART_X_FTOT] = 0;
		 dest[j + PART_Y_FTOT] = 0;
		 dest[j + PART_Z_FTOT] = 0;
		 
		 dest[j + PART_R] = 0;
		 dest[j + PART_G] = 0;
		 dest[j + PART_B] = 0;
		 
		 dest[j + PART_MASS] = 0;
		 dest[j + PART_DIAM] = 0;
		 
		 dest[j + PART_AGE] = 1;
		 
		 dest[j + PART_RENDMODE] = 0;
	}

}

PartSys.prototype.render = function(ModelMat, MVPMat, Eye, clothMode) {
//==============================================================================
	this.age += (g_timeStep*0.001);
	gl.useProgram(this.shaderLoc);

	//a) Re-bind Buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vboID);
	if(clothMode == 1){
		this.makeCloth();
		gl.bufferSubData( gl.ARRAY_BUFFER, 0, this.vbo);
	}
	else{	
		gl.bufferSubData( gl.ARRAY_BUFFER, 0, this.s0); // Float32Array data source.
	}

	//b) Re-assign attribute pointers
	gl.vertexAttribPointer(this.a_PositionID,  4, gl.FLOAT,  false, PART_MAXVAR*this.FSIZE, PART_XPOS * this.FSIZE); 
	gl.vertexAttribPointer(this.a_ColorID,  3, gl.FLOAT,  false, PART_MAXVAR*this.FSIZE, PART_R * this.FSIZE); 
	gl.vertexAttribPointer(this.a_PointSizeID,  1, gl.FLOAT,  false, PART_MAXVAR*this.FSIZE, PART_DIAM * this.FSIZE); 
	
	//c) enable the newly-reassigned attributes
	gl.enableVertexAttribArray(this.a_PositionID);
	gl.enableVertexAttribArray(this.a_ColorID);
	gl.enableVertexAttribArray(this.a_PointSizeID);
	
	gl.uniform1i(this.u_runModeID, this.runMode);	// run/step/pause the particle system 
	
	

	gl.uniformMatrix4fv(this.u_ModelMatLoc,	false, ModelMat.elements);	
	gl.uniformMatrix4fv(this.u_MVPMatLoc,	false, MVPMat.elements);
	
	gl.uniform3f(this.u_EyePosLoc,	Eye.elements[0], Eye.elements[1], Eye.elements[2]);
	
	
	if(clothMode == 1){
		gl.drawArrays(gl.TRIANGLE_STRIPS, 0, 2*this.partPerRow); 
	}
	else{
		gl.drawArrays(gl.POINTS, 0, this.partCount); 
	}
}

 PartSys.prototype.solver = function() {
//==============================================================================
// Find next state s1 from current state s0 (and perhaps some related states
// such as s0dot, sM, sMdot, etc.) by the numerical integration method chosen
// by PartSys.solvType.

		switch(this.solvType)
		{
		  case 0://-----------------------------------------------------------------
			
			//RK2 --> Runge-Kutta
			this.swap(this.s1, this.s0);
	  
			s0dot = new Float32Array(this.partCount * PART_MAXVAR);
			sM = new Float32Array(this.partCount * PART_MAXVAR);
			sMdot = new Float32Array(this.partCount * PART_MAXVAR);
			
			this.applyForces(this.s0, this.forces);
			this.dotFinder(this.s0, s0dot);
				//console.log("S0Dot: " + s0dot);
			for(var i = 0; i<this.partCount*PART_MAXVAR; i++){
				sM[i] = this.s0[i]+s0dot[i]*(g_timeStep*0.0005);
			}
				//console.log("SM: " + sM);
			
			this.dotFinder(sM, sMdot);
				//console.log("SMDot: " + sMdot);
			for(var i = 0; i < this.partCount*PART_MAXVAR; i+=1){
				//EXPLICIT SOLVER IS UNSTABLE
				//this.s1[i] = this.s0[i] + s0dot[i]*(g_timeStep*0.001);
				//RK-2
				this.s1[i] = this.s0[i]+sMdot[i]*(g_timeStep*0.001);
			}
			//console.log("S0: " + this.s0);
			//console.log(" S0Dot: " + this.s0dot);

		  break;
		case 1://-------------------------------------------------------------------
			
			//RK1 --> Euler Solver
			this.swap(this.s1, this.s0);   
      
			var s0dot = new Float32Array(this.partCount * PART_MAXVAR);
	
			this.applyForces(this.s0, this.forces);
			this.dotFinder(this.s0, s0dot);
			
			for(var i = 0; i<this.partCount*PART_MAXVAR; i++){
				this.s1[i] = this.s0[i]+ s0dot[i]*(g_timeStep*0.001);
			}

		  break;
		  
		case 2:
		
			//Verlet Solver
			
			var timeStep = (g_timeStep*0.001);
			var s1dot2 = new Float32Array(this.partCount * PART_MAXVAR);
			var s2dot2 = new Float32Array(this.partCount * PART_MAXVAR);
			
			this.applyForces(this.s1, this.forces);
			this.dotFinder2(this.s1, s1dot2);
			
			
			this.swap(this.s1, this.s2);
			
			for(var j = 0; j<this.partCount*PART_MAXVAR; j+= PART_MAXVAR){
				this.s2[j + PART_XPOS] = this.s1[j+ PART_XPOS] + this.s1[j + PART_XVEL]*timeStep + (s1dot2[j + PART_XPOS]*Math.pow(timeStep,2))/2; 
				this.s2[j + PART_YPOS] = this.s1[j+ PART_YPOS] + this.s1[j + PART_YVEL]*timeStep + (s1dot2[j + PART_YPOS]*Math.pow(timeStep,2))/2;  
				this.s2[j + PART_ZPOS] = this.s1[j+ PART_ZPOS] + this.s1[j + PART_ZVEL]*timeStep + (s1dot2[j + PART_ZPOS]*Math.pow(timeStep,2))/2;  
			}
			
			//console.log(this.s1);
			this.applyForces(this.s2, this.forces);
			this.dotFinder2(this.s2, s2dot2);
			
			for(var j = 0; j<this.partCount*PART_MAXVAR; j+= PART_MAXVAR){
				this.s2[j + PART_XVEL] = this.s1[j + PART_XVEL] + ((s1dot2[j + PART_XPOS] + s2dot2[j + PART_XPOS])*Math.pow(timeStep,2))/2; 
				this.s2[j + PART_YVEL] = this.s1[j + PART_YVEL] + ((s1dot2[j + PART_YPOS] + s2dot2[j + PART_YPOS])*Math.pow(timeStep,2))/2; 
				this.s2[j + PART_ZVEL] = this.s1[j + PART_ZVEL] + ((s1dot2[j + PART_ZPOS] + s2dot2[j + PART_ZPOS])*Math.pow(timeStep,2))/2; 
				this.s2[j + PART_AGE] += timeStep;
			}
			
			this.swap(this.s1, this.s0); 
			this.swap(this.s2, this.s1);
			
			break;
			
		default:
			console.log('?!?! unknown solver: g_partA.solvType==' + this.solvType);
			break;
		}
		return;
}

PartSys.prototype.applyConstraints = function() {
//==============================================================================
for(j = 0; j < this.limitCount*LIMIT_MAXVAR; j+= LIMIT_MAXVAR){
	switch(this.limiters[j + CLIMIT_TYPE]){
		
		case CLIMIT_WALLS:
			
			var minX = this.limiters[j + CLIMIT_MIN_X]; 
			var maxX = this.limiters[j + CLIMIT_MAX_X]; 
			var minY = this.limiters[j + CLIMIT_MIN_Y]; 
			var maxY = this.limiters[j + CLIMIT_MAX_Y]; 
			var minZ = this.limiters[j + CLIMIT_MIN_Z]; 
			var maxZ = this.limiters[j + CLIMIT_MAX_Z]; 
			var resti = this.limiters[j + CLIMIT_RESTI];
							
			for(var i = 0; i < this.partCount*PART_MAXVAR; i+= PART_MAXVAR) {
				//BOUNCE TYPE 1
				if(this.bounceType==0) { //------------------------------------------------
					
					//VELOCITY BOUNDARIES
					if( this.s1[PART_XPOS + i] < minX && this.s1[PART_XVEL + i] < 0.0 ) {		
						this.s1[PART_XVEL + i] = -resti * this.s1[PART_XVEL + i];
					}
					else if( this.s1[PART_XPOS + i] >  maxX && this.s1[PART_XVEL + i] > 0.0 ) {		
						this.s1[PART_XVEL + i] = -resti * this.s1[PART_XVEL + i];
					} 
					if(     this.s1[PART_YPOS + i] < minY && this.s1[PART_YVEL + i] < 0.0 ) {
						this.s1[PART_YVEL + i] = -resti * this.s1[PART_YVEL + i];
					}
					else if( this.s1[PART_YPOS + i] >  maxY && this.s1[PART_YVEL + i] > 0.0 ) {		
						this.s1[PART_YVEL + i] = -resti * this.s1[PART_YVEL + i];
					}
					if(     this.s1[PART_ZPOS + i] < minZ && this.s1[PART_ZVEL + i] < 0.0 ) {
						this.s1[PART_ZVEL + i] = -resti * this.s1[PART_ZVEL + i];
					}
					else if( this.s1[PART_ZPOS + i] >  maxZ && this.s1[PART_ZVEL + i] > 0.0 ) {		
						this.s1[PART_ZVEL + i] = -resti * this.s1[PART_ZVEL + i];
					} //--------------------------
					
					//POSITION BOUNDARIES
					if(      this.s1[PART_XPOS + i] < minX) this.s1[PART_XPOS + i] = minX; 
					else if( this.s1[PART_XPOS + i] >  maxX) this.s1[PART_XPOS + i] =  maxX; 
					if(     this.s1[PART_YPOS + i] < minY) this.s1[PART_YPOS + i] = minY;
					else if( this.s1[PART_YPOS + i] >  maxY) this.s1[PART_YPOS + i] =  maxY; 
					if(     this.s1[PART_ZPOS + i] < minZ) this.s1[PART_ZPOS + i] = minZ;
					else if( this.s1[PART_ZPOS + i] >  maxZ) this.s1[PART_ZPOS + i] =  maxZ; 
				}
				
				
				else if (this.bounceType==1) { 
				//---------------------------------------------------------------------------
					if( this.s1[PART_XPOS + i] < minX && this.s1[PART_XVEL + i] < 0.0 ) {
					
						this.s1[PART_XPOS + i] = minX;					
						this.s1[PART_XVEL + i] = this.s0[PART_XVEL + i];	
						//this.s1[PART_XVEL + i] *= this.drag;
						if(  this.s1[PART_XVEL + i] < 0.0) 
							this.s1[PART_XVEL + i] = -resti * this.s1[PART_XVEL + i]; 
						else 
							this.s1[PART_XVEL + i] =  resti * this.s1[PART_XVEL + i];	
					}
					else if (this.s1[PART_XPOS + i] >  maxX && this.s1[PART_XVEL + i] > 0.0) {		// collision! right wall...

						this.s1[PART_XPOS + i] = maxX;					
						this.s1[PART_XVEL + i] = this.s0[PART_XVEL];
						//this.s1[PART_XVEL + i] *= this.drag;			
						// **BUT** reduced by drag (and any other forces that still apply during this timestep).						

						if(this.s1[PART_XVEL + i] > 0.0) 
							this.s1[PART_XVEL + i] = -resti * this.s1[PART_XVEL + i]; 
						else 
							this.s1[PART_XVEL + i] =  resti * this.s1[PART_XVEL + i];	
					}
					if( this.s1[PART_YPOS + i] < minY && this.s1[PART_YVEL + i] < 0.0) {		// collision! floor...
					

						this.s1[PART_YPOS + i] = minY;					
						this.s1[PART_YVEL + i] = this.s0[PART_YVEL + i];
						//this.s1[PART_YVEL + i] *= this.drag;			

						if(this.s1[PART_YVEL + i] < 0.0) 
							this.s1[PART_YVEL + i] = -resti * this.s1[PART_YVEL + i]; 
						else 
							this.s1[PART_YVEL + i] =  resti * this.s1[PART_YVEL + i];	
					 		
					}
					else if( this.s1[PART_YPOS + i] > maxY && this.s1[PART_YVEL + i] > 0.0) { 		
						this.s1[PART_YPOS + i] = maxY;					
						this.s1[PART_YVEL + i] = this.s0[PART_YVEL + i];			
						//this.s1[PART_YVEL + i] *= this.drag;			

						if(this.s1[PART_YVEL + i] > 0.0) 
							this.s1[PART_YVEL + i] = -resti * this.s1[PART_YVEL + i]; 
						else 
							this.s1[PART_YVEL + i] =  resti * this.s1[PART_YVEL + i];	
					}
					//Bounds in the Z coordinate
					if( this.s1[PART_ZPOS + i] < minZ && this.s1[PART_ZVEL + i] < 0.0) {		// collision! floor...
					

						this.s1[PART_ZPOS + i] = minZ;					
						this.s1[PART_ZVEL + i] = this.s0[PART_ZVEL + i];
						//this.s1[PART_YVEL + i] *= this.drag;			

						if(this.s1[PART_ZVEL + i] < 0.0) 
							this.s1[PART_ZVEL + i] = -resti * this.s1[PART_ZVEL + i]; 
						else 
							this.s1[PART_ZVEL + i] =  resti * this.s1[PART_ZVEL + i];	
					 		
					}
					else if( this.s1[PART_ZPOS + i] > maxZ && this.s1[PART_ZVEL + i] > 0.0) { 		
						this.s1[PART_ZPOS + i] = maxZ;					
						this.s1[PART_ZVEL + i] = this.s0[PART_ZVEL + i];			
						//this.s1[PART_YVEL + i] *= this.drag;			

						if(this.s1[PART_ZVEL + i] > 0.0) 
							this.s1[PART_ZVEL + i] = -resti * this.s1[PART_ZVEL + i]; 
						else 
							this.s1[PART_ZVEL + i] =  resti * this.s1[PART_ZVEL + i];	
					}
				}
				else {
					console.log('?!?! unknown constraint: PartSys.bounceType==' + this.bounceType);
					return;
				}
			}
			
			break;
		
		case CLIMIT_FOUNTAIN:
			
			for(var i = 0; i < this.partCount*PART_MAXVAR; i+= PART_MAXVAR) {
				
				this.s1[PART_R + i] += 0.0*(g_timeStep*0.0005);
				this.s1[PART_G + i] += 0.12*(g_timeStep*0.0005);
				this.s1[PART_B + i] += -0.13*(g_timeStep*0.0005);
				
				if(this.s1[PART_AGE + i] > this.limiters[j + CLIMIT_LIFETIME]){
					
					this.s1[PART_XPOS + i] = this.limiters[j + CLIMIT_MIN_X];
					this.s1[PART_YPOS + i] = this.limiters[j + CLIMIT_MIN_Y];
					this.s1[PART_ZPOS + i] = this.limiters[j + CLIMIT_MIN_Z];
					
					
					//TODO --> randomize the direction
					var angle = (Math.random()*2 -1)*2*Math.PI ;
					this.s1[PART_ZVEL + i] = this.limiters[j + CLIMIT_RELAUNCH] + Math.random()*3;
					this.s1[PART_XVEL + i] = this.limiters[j + CLIMIT_RELAUNCH]*Math.cos(angle);
					this.s1[PART_YVEL + i] = this.limiters[j + CLIMIT_RELAUNCH]*Math.sin(angle);
					
					this.s1[PART_AGE + i] = 0.0;
					
					this.s1[PART_R + i] = 0.2;
					this.s1[PART_G + i] = 0.0;
					this.s1[PART_B + i] = 0.9;
				}
			}
			
			break;
		
		
		case CLIMIT_ANCHOR:
			
			var i = this.limiters[j + CLIMIT_A]*PART_MAXVAR; 
			
			//console.log(this.s1[PART_XPOS + i] + " " + this.s1[PART_YPOS + i]+ " " + this.s1[PART_ZPOS + i]);
			//console.log(this.limiters[j + CLIMIT_MIN_X] + " " + this.limiters[j + CLIMIT_MIN_Y]+ " " + this.limiters[j + CLIMIT_MIN_Z]);
			this.s1[PART_XPOS + i] = this.limiters[j + CLIMIT_MIN_X];
			this.s1[PART_YPOS + i] = this.limiters[j + CLIMIT_MIN_Y];
			this.s1[PART_ZPOS + i] = this.limiters[j + CLIMIT_MIN_Z];
			
			this.s1[PART_XVEL + i] = 0;
			this.s1[PART_YVEL + i] = 0;
			this.s1[PART_ZVEL + i] = 0;
		
			break; 
		
		case CLIMIT_FIRE:
			
			
			var lim = 350;
			var current = 0;
			for(var i = 0; i < this.partCount*PART_MAXVAR; i+= PART_MAXVAR) {
				
				var stepR = (this.endColor.R -this.startColor.R)/this.lifeTime;
				var stepG = (this.endColor.G -this.startColor.G)/this.lifeTime;
				var stepB = (this.endColor.B -this.startColor.B)/this.lifeTime;
				var stepSize = (this.endSize -this.startSize)/this.lifeTime;
				
				this.s1[PART_R + i] += stepR *(g_timeStep*0.001);
				this.s1[PART_G + i] += stepG*(g_timeStep*0.001);
				this.s1[PART_B + i] += stepB*(g_timeStep*0.001);
				
				this.s1[PART_DIAM + i] +=  stepSize* (g_timeStep*0.001);
				
				if(this.s1[PART_AGE + i] >= this.limiters[j + CLIMIT_LIFETIME] && current < lim){
					
					this.s1[PART_XPOS + i] = this.limiters[j + CLIMIT_MIN_X] + (Math.random()-1/2);
					this.s1[PART_YPOS + i] = this.limiters[j + CLIMIT_MIN_Y] + (Math.random()-1/2);
					this.s1[PART_ZPOS + i] = this.limiters[j + CLIMIT_MIN_Z];
					
					
					//TODO --> randomize the direction
					this.s1[PART_XVEL + i] = this.limiters[j + CLIMIT_RELAUNCH]*2*(Math.random()-1/2);
					this.s1[PART_YVEL + i] = this.limiters[j + CLIMIT_RELAUNCH]*2*(Math.random()-1/2);
					
					this.s1[PART_ZVEL + i] = this.limiters[j + CLIMIT_RELAUNCH]*(Math.random() + 3);
					
					this.s1[PART_AGE + i] = 0.0;
					
					this.s1[PART_R + i] = this.startColor.R;
					this.s1[PART_G + i] = this.startColor.G;
					this.s1[PART_B + i] = this.startColor.B;
					
					this.s1[PART_DIAM + i] = this.startSize + Math.random()*2;
					current ++;
				}
			}
			
			break;
			
		case CLIMIT_B_OUTSIDE:
		
			if(this.age > this.lastOut + this.limiters[j + CLIMIT_LIFETIME]){
				
				this.lastOut = this.age;
				for(var ii = 0; ii<this.outside*PART_MAXVAR; ii+=PART_MAXVAR){
					
					
					var Charge = -this.limiters[j + CLIMIT_MAXFORCE] + Math.random()*2*this.limiters[j + CLIMIT_MAXFORCE];
					
					this.s1[PART_CHARGE + ii] = Charge;
					this.s1[PART_XPOS + ii] = this.limiters[j + CLIMIT_MIN_X] + Math.random()*(this.limiters[j + CLIMIT_MAX_X] - this.limiters[j + CLIMIT_MIN_X]);
					this.s1[PART_YPOS + ii] = this.limiters[j + CLIMIT_MIN_Y] + Math.random()*(this.limiters[j + CLIMIT_MAX_Y] - this.limiters[j + CLIMIT_MIN_Y]);
					this.s1[PART_ZPOS + ii] = this.limiters[j + CLIMIT_MIN_Z] + Math.random()*(this.limiters[j + CLIMIT_MAX_Z] - this.limiters[j + CLIMIT_MIN_Z]);
					
					
					if(Charge>0){
						this.s1[PART_R + ii] = 0.0;
						this.s1[PART_G + ii] = 0.4+ 0.2 * Charge;
						this.s1[PART_B + ii] = 0.0;
					}
					else{
						this.s1[PART_R + ii] = 0.4 + -0.4 * Charge;
						this.s1[PART_G + ii] = 0.0;
						this.s1[PART_B + ii] = 0.0;
					}
					//console.log("New attractor: " + ii + " Charge: " + Charge +
					//" X: " +this.s1[PART_XPOS + ii] + " Y: " +this.s1[PART_YPOS + ii] + " Z: " +this.s1[PART_ZPOS + ii]); 
				}
			}
			break;
			
		case CLIMIT_CYLINDER:
			//Bounds in the Z coordinate
			for(var i = 0; i<this.partCount*PART_MAXVAR; i+=PART_MAXVAR){
				var maxZ = this.limiters[j + CLIMIT_MAX_Z];
				var minZ = this.limiters[j + CLIMIT_MIN_Z];
				var resti = this.limiters[j + CLIMIT_RESTI];
				if( this.s1[PART_ZPOS + i] < minZ && this.s1[PART_ZVEL + i] < 0.0) {		// collision! floor...
					
					this.s1[PART_ZPOS + i] = minZ;					
					this.s1[PART_ZVEL + i] = this.s0[PART_ZVEL + i];
					//this.s1[PART_YVEL + i] *= this.drag;			

					if(this.s1[PART_ZVEL + i] < 0.0) 
						this.s1[PART_ZVEL + i] = -resti * this.s1[PART_ZVEL + i]; 
					else 
						this.s1[PART_ZVEL + i] =  resti * this.s1[PART_ZVEL + i];	
						
				}
				else if( this.s1[PART_ZPOS + i] > maxZ && this.s1[PART_ZVEL + i] > 0.0) { 		
					this.s1[PART_ZPOS + i] = maxZ;					
					this.s1[PART_ZVEL + i] = this.s0[PART_ZVEL + i];			
					//this.s1[PART_YVEL + i] *= this.drag;			

					if(this.s1[PART_ZVEL + i] > 0.0) 
						this.s1[PART_ZVEL + i] = -resti * this.s1[PART_ZVEL + i]; 
					else 
						this.s1[PART_ZVEL + i] =  resti * this.s1[PART_ZVEL + i];	
				}
				
				
				var r = Math.sqrt(Math.pow(this.s1[PART_XPOS + i],2) + Math.pow(this.s1[PART_YPOS + i], 2));
				var v = Math.sqrt(Math.pow(this.s1[PART_XVEL + i],2) + Math.pow(this.s1[PART_YVEL + i], 2));
				var RDotV = this.s1[PART_XPOS + i]*this.s1[PART_XVEL + i] + this.s1[PART_YPOS + i]*this.s1[PART_YVEL + i];
				var R = this.limiters[j + CLIMIT_RADIUS];
				
				
				//console.log(r);
				if(r > R && RDotV > 0){
					
					//THIS IMPLEMENTATION SHOULD BE MUCH BETTER BUT IT DOESN'T WORK YET
					
					//console.log("r: " + r);
					//var Vr = (this.s1[PART_XPOS + i]*this.s1[PART_XVEL + i] + this.s1[PART_YPOS + i]*this.s1[PART_YVEL + i])/r;
					//console.log("V: " + this.s1[PART_XVEL + i] + ", " + this.s1[PART_YVEL + i] + " R: " +  + this.s1[PART_XPOS + i] + ", " + this.s1[PART_YPOS + i] + " Vr: " +  Vr);
					//this.s1[PART_XVEL + i] = (this.s1[PART_XVEL + i] - 2*this.s1[PART_XPOS]*Vr)*resti;
					//this.s1[PART_YVEL + i] = (this.s1[PART_YVEL + i] - 2*this.s1[PART_YPOS]*Vr)*resti;
					//console.log("New R: "  + this.s1[PART_XPOS + i] + ", " + this.s1[PART_YPOS + i]); 
					
					this.s1[PART_XVEL + i] = -this.s1[PART_XPOS + i]*v*resti/r;
					this.s1[PART_YVEL + i] = -this.s1[PART_YPOS + i]*v*resti/r;
					
					this.s1[PART_XPOS + i] = this.s1[PART_XPOS + i]*R/r;
					this.s1[PART_YPOS + i] = this.s1[PART_YPOS + i]*R/r;
					//console.log("New V: " + this.s1[PART_XVEL + i] + ", " + this.s1[PART_YVEL + i]);
				}
			}
			break;
		default:
			console.log('Unknown CLIMIT type!');
	}

}
}

PartSys.prototype.swap = function(src, dest) {
//==============================================================================

// Exchange contents of state-vector s0, s1.
//  var tmp = this.s0;
  dest.set(src);
//  this.s1 = tmp;
}


