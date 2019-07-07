function DrawBody(Parent){
	
	var temp = new Matrix4();
	temp.set(Parent);
	if(debug == 0){
		pushMatrix(temp);
			temp.rotate(180,0,1,0);
			temp.translate(0,0,-0.6);
			temp.scale(1.8,1,0.5);
			DrawPara(temp, longIndex);
			temp.scale(1,1,2);
			temp.translate(0,0,1.1);
			DrawPara(temp, cubeIndex);
		temp = popMatrix();
	}
	else{
		DrawDebug(temp);
	}
}