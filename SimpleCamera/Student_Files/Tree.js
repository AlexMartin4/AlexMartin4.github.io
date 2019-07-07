TreeCount = 20;
TreeArea = (1.5*3.5)^2;
TreePlacements = [];
xymin = 10;

function DrawTree(Parent){
	
	temp = new Matrix4();
	temp.set(Parent);
	pushMatrix(temp);
	    temp.scale(1.5,1.5,4);
		temp.translate(0,0,0.5);
		DrawCylinder(temp, trunkIndex);
		temp.translate(0,0,1);
		temp.scale(3.5, 3.5, 2);
		
		DrawCylinder(temp, coneIndex);
	temp = popMatrix();
}

function FindRandomTreePlacements(){
	for(var i = 0; i < TreeCount; i++){
		var x = 0;
		while(x < xymin && x > -xymin){
			x = (Math.random() - 0.5)*2*xymax;
		}
		var y = 0;
		while(y < xymin && y > -xymin){
			y = (Math.random() - 0.5)*2*xymax;
		}
		var vect = new Vector4([x, y, 0.0, 1.0]);
		TreePlacements.push(vect);
		vect.printMe();
	}
	
}