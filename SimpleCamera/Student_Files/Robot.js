function DrawRobot(Parent){
	var temp =  new Matrix4();
	temp.set(Parent);
	pushMatrix(temp)
			pushMatrix(temp);
				temp.translate(0,0,3);
				DrawBody(temp);
				pushMatrix(temp);
					temp.translate(-0.9,0,0.8)
					temp.rotate(-90,0,1,0);
					temp.rotate(-90,0,0,1);
					temp.scale(0.5,0.5,0.5);
					DrawArm(temp, 'R');
				temp = popMatrix();
				pushMatrix(temp);
					temp.translate(0.9,0,0.8)
					temp.rotate(-90,0,1,0);
					temp.rotate(-90,0,0,1);
					temp.scale(0.5,0.5,0.5);
					DrawArm(temp, 'L');
				temp = popMatrix();
				pushMatrix(temp);
					temp.translate(0,0,1.75);
					DrawHead(temp, headIndex);
				temp = popMatrix();
				pushMatrix(temp);
					temp.translate(0,0,-2);
					DrawTreads(temp, 0.8);
				temp = popMatrix();
			temp = popMatrix();
	temp = popMatrix();
}