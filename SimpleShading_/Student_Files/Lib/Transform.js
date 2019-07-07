function Transform(matrix4){
	this.matrix = new Matrix4();
	this.matrix.setIdentity();
	this.Children = new Array();
}

Transform.prototype.addChild = function(matrix4){
	this.Children.push(matrix4);
}

Transform.prototype.propagateTransforms = function(Parent){
	
	var temp = new Matrix4();
	temp.set(Parent);
	this.matrix = temp.concat(this.matrix);
	if(this.Children.length >0)
	{

		for (i=0; i< this.Children.length; i++){
			//console.log(this.matrix.printMe());
			(this.Children[i]).propagateTransforms(this.matrix);
		}
	}
}
