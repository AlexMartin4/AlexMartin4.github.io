function CForcer(){

}

//Code for force types
CFORCER_2END_SPRING = 0;
CFORCER_CONSTANT_FIELD = 1;
CFORCER_DRAG = 2;
CFORCER_TORNADO = 3;
CFORCER_WIND = 4;
CFORCER_B_SEPARATION = 5;
CFORCER_B_ALIGNMENT = 6;
CFORCER_B_COHESION = 7;
CFORCER_B_OUTSIDE = 8;

//Force attribute codes
CFORCER_TYPE = 0;
CFORCER_K_CONST = 1;
CFORCER_R_LENGTH = 2;
CFORCER_DAMPING = 3;
CFORCER_A = 4;
CFORCER_B = 5;
CFORCER_FIELD_CONST = 6;
CFORCER_X = 7;
CFORCER_Y = 8;
CFORCER_Z = 9;
CFORCER_UPDRAFT = 10;
CFORCER_MAXFORCE =11;
CFORCER_TAU = 12;
CFORCER_INDRAFT = 13;

CFORCER_MAXVAR = 14;


CForcer.prototype.init2EndSpring = function(k, l_rest, c, indexA, indexB)
{
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_2END_SPRING;
	this.attributes[CFORCER_K_CONST] = k;
	this.attributes[CFORCER_R_LENGTH] = l_rest;
	this.attributes[CFORCER_DAMPING] = c;
	this.attributes[CFORCER_A] = indexA;
	this.attributes[CFORCER_B] = indexB;
	
}

CForcer.prototype.initGravity = function(x, y, z)
{
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_CONSTANT_FIELD;
	this.attributes[CFORCER_FIELD_CONST] = 9.832;
	
	var downMag = Math.sqrt(x*x + y*y + z*z);
	
	this.attributes[CFORCER_X] = x/downMag;
	this.attributes[CFORCER_Y] = y/downMag;
	this.attributes[CFORCER_Z] = z/downMag;
}
CForcer.prototype.initDrag = function(damping)
{
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_DRAG;
	this.attributes[CFORCER_DAMPING] = damping;
}
CForcer.prototype.initTornado = function(updraft, maxForce, tau, indraft){
	
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_TORNADO;
	
	this.attributes[CFORCER_UPDRAFT] = updraft;
	this.attributes[CFORCER_MAXFORCE] = maxForce;
	this.attributes[CFORCER_TAU] = tau;
	this.attributes[CFORCER_INDRAFT] = indraft;

}

CForcer.prototype.initWind = function(x, y, z, minForce, maxForce, length){
	
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_WIND;
	
	this.attributes[CFORCER_FIELD_CONST] = minForce;
	this.attributes[CFORCER_MAXFORCE] = maxForce;
	
	var dirMag = Math.sqrt(x*x + y*y + z*z);
	
	this.attributes[CFORCER_X] = x/dirMag;
	this.attributes[CFORCER_Y] = y/dirMag;
	this.attributes[CFORCER_Z] = z/dirMag;
	
	this.attributes[CFORCER_TAU] = length;
}


CForcer.prototype.initBoidsSeparation = function(intensity){
	
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_B_SEPARATION;
	this.attributes[CFORCER_MAXFORCE] = intensity;
}

CForcer.prototype.initBoidsAlignment = function(intensity){
	
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_B_ALIGNMENT;
	this.attributes[CFORCER_MAXFORCE] = intensity;
}

CForcer.prototype.initBoidsCohesion = function(intensity, x, y, z){
	
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_B_COHESION;
	
	this.attributes[CFORCER_MAXFORCE] = intensity;	
	this.attributes[CFORCER_X] = x;
	this.attributes[CFORCER_Y] = y;
	this.attributes[CFORCER_Z] = z;
}
CForcer.prototype.initBoidsOutside = function(intensity){
	
	this.attributes = new Array(CFORCER_MAXVAR);
	
	this.attributes[CFORCER_TYPE] = CFORCER_B_OUTSIDE;
	
	this.attributes[CFORCER_MAXFORCE] = intensity;	
}
