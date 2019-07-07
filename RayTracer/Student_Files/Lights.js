function CLight(){
	
	this.colors = new LightColor();
	this.position = vec4.create();
	this.isOn = true;
	
}

function LightColor(){
	this.ambi = vec4.create();
	this.diff = vec4.create();
	this.spec = vec4.create();
	this.specExp = 0;
}

LightColor.prototype.setValues = function(newAmbi, newDiff, newSpec, newSpecExp){
	
	if(newAmbi){vec4.copy(this.ambi, newAmbi);}
	if(newDiff){vec4.copy(this.diff, newDiff);}
	if(newSpec){vec4.copy(this.spec, newSpec);}
	if(newSpecExp){vec4.copy(specExp, newSpecExp);}
}