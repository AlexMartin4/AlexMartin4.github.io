treadCount = 12;
treadAngle = 360/treadCount;
currentTreadAngle = {'value' : 0};

function DrawTreads(Parent, Radius, Mat){
	var temp = new Matrix4();
	temp.set(Parent);
	
	
	pushMatrix(temp);	
		DrawDebug(temp);
		//temp.setRotate(currentTreadAngle , 1, 0, 0);
		//console.log(currentTreadAngle.value);
		for(var i = 0; i < treadCount; i++){
			pushMatrix(temp);
				temp.rotate( treadAngle*i + currentTreadAngle.value , 1 , 0, 0);
				//var angLee = i*treadAngle*0.0174533;
				temp.translate(0,0,Radius);// 0.25* (longAxis*Math.pow(Math.sin(angLee),2) +  shortAxis*Math.pow(Math.cos(angLee),2)));
				temp.scale(2, 0.4 ,0.25 );
				DrawPara(temp, cubeIndex, Mat);
			temp = popMatrix();
		}
	temp = popMatrix();
}