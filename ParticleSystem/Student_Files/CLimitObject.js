function CLimiter(){

}

//Code for contraint type
CLIMIT_WALLS = 0;
CLIMIT_FOUNTAIN = 1;
CLIMIT_ANCHOR = 2;
CLIMIT_FIRE = 3;
CLIMIT_B_OUTSIDE = 4;
CLIMIT_CYLINDER = 5;

//Constraint attribute codes

CLIMIT_TYPE = 0;
CLIMIT_MIN_X = 1;
CLIMIT_MAX_X = 2;
CLIMIT_MIN_Y = 3;
CLIMIT_MAX_Y = 4;
CLIMIT_MIN_Z = 5;
CLIMIT_MAX_Z = 6;
CLIMIT_RESTI = 7;
CLIMIT_LIFETIME = 8;
CLIMIT_RELAUNCH = 9;
CLIMIT_A = 10;
CLIMIT_MAXFORCE = 11;
CLIMIT_RADIUS = 12;

LIMIT_MAXVAR = 13;


CLimiter.prototype.initWalls = function(minX, maxX, minY, maxY, minZ, maxZ, resti)
{
	this.attributes = new Array(LIMIT_MAXVAR);
	
	this.attributes[CLIMIT_TYPE] = CLIMIT_WALLS;
	
	this.attributes[CLIMIT_MIN_X] = minX;
	this.attributes[CLIMIT_MAX_X] = maxX;
	this.attributes[CLIMIT_MIN_Y] = minY;
	this.attributes[CLIMIT_MAX_Y] = maxY;
	this.attributes[CLIMIT_MIN_Z] = minZ;
	this.attributes[CLIMIT_MAX_Z] = maxZ;
	this.attributes[CLIMIT_RESTI] = resti;
	
}

CLimiter.prototype.initFountain = function(lifeTime, relaunchSpd, baseX, baseY, baseZ){

	this.attributes = new Array(LIMIT_MAXVAR);
	
	this.attributes[CLIMIT_TYPE] = CLIMIT_FOUNTAIN;
	this.attributes[CLIMIT_LIFETIME] = lifeTime;
	this.attributes[CLIMIT_RELAUNCH] = relaunchSpd;
	this.attributes[CLIMIT_MIN_X] = baseX;
	this.attributes[CLIMIT_MIN_Y] = baseY;
	this.attributes[CLIMIT_MIN_Z] = baseZ;
	
}
CLimiter.prototype.initAnchor = function(index, x, y, z){
	
	this.attributes = new Array(LIMIT_MAXVAR);
	
	this.attributes[CLIMIT_TYPE] = CLIMIT_ANCHOR;
	this.attributes[CLIMIT_MIN_X] = x;
	this.attributes[CLIMIT_MIN_Y] = y;
	this.attributes[CLIMIT_MIN_Z] = z;
	this.attributes[CLIMIT_A] = index;
}


CLimiter.prototype.initFire = function(lifeTime, relaunchSpd, baseX, baseY, baseZ){

	this.attributes = new Array(LIMIT_MAXVAR);
	
	this.attributes[CLIMIT_TYPE] = CLIMIT_FIRE;
	
	this.attributes[CLIMIT_LIFETIME] = lifeTime;
	this.attributes[CLIMIT_RELAUNCH] = relaunchSpd;
	this.attributes[CLIMIT_MIN_X] = baseX;
	this.attributes[CLIMIT_MIN_Y] = baseY;
	this.attributes[CLIMIT_MIN_Z] = baseZ;
	
}
CLimiter.prototype.initBoidsOutside = function(minX, maxX, minY, maxY, minZ, maxZ, maxForce, lifeTime){

	this.attributes = new Array(LIMIT_MAXVAR);
	
	this.attributes[CLIMIT_TYPE] = CLIMIT_B_OUTSIDE;
	
	this.attributes[CLIMIT_MIN_X] = minX;
	this.attributes[CLIMIT_MAX_X] = maxX;
	this.attributes[CLIMIT_MIN_Y] = minY;
	this.attributes[CLIMIT_MAX_Y] = maxY;
	this.attributes[CLIMIT_MIN_Z] = minZ;
	this.attributes[CLIMIT_MAX_Z] = maxZ;
	
	this.attributes[CLIMIT_MAXFORCE] = maxForce;
	this.attributes[CLIMIT_LIFETIME] = lifeTime;
}
CLimiter.prototype.initCylinder = function(radius, minZ, maxZ, resti)
{
	this.attributes = new Array(LIMIT_MAXVAR);
	
	this.attributes[CLIMIT_TYPE] = CLIMIT_CYLINDER;
	
	this.attributes[CLIMIT_RADIUS] = radius;
	this.attributes[CLIMIT_MIN_Z] = minZ;
	this.attributes[CLIMIT_MAX_Z] = maxZ;
	this.attributes[CLIMIT_RESTI] = resti;
	
}