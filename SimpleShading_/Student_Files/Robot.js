function DrawRobot(Parent){
	var temp =  new Matrix4();
	temp.set(Parent);
	pushMatrix(temp)
			pushMatrix(temp);
				temp.translate(0,0,3);
				DrawBody(temp, MATL_RED_PLASTIC, MATL_OBSIDIAN);
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
					temp.rotate(90, 1,0,0);
					DrawHead(temp, headIndex);
				temp = popMatrix();
				pushMatrix(temp);
					temp.translate(0,0,-2);
					DrawTreads(temp, 0.8, MATL_BLACK_RUBBER);
				temp = popMatrix();
			temp = popMatrix();
	temp = popMatrix();
}