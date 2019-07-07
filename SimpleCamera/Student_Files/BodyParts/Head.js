function AppendHead(){
	
	var smallRadius = 0.7;
	var largeRadius = 1;
	var length = 1;
	var count = 20;
	var angle = 360/count;
	
	pupilCounter = 0;
	backOfHeadCounter = 0;
	sideOfHeadCounter = 0;
	insideHeadCounter = 0
	
	var BackOfHeadCenter = new Vector4([0.0, 0.0, -length/2,1.0]);
	var BackOfHeadVector = new Vector4([0.0, smallRadius/2, -length/2, 1.0]);
	
	var FrontOfHeadVector = new Vector4([0.0, largeRadius/2, length/2, 1.0]);
	
	var PupilCenter = new Vector4([0,0,0.2,1.0]);
	var PupilVector = new Vector4([0, largeRadius/4 , 0.2, 1.0]);
	var Rotate = new Matrix4();
	Rotate.setRotate(angle, 0,0,1);
	var RotateNegative = new Matrix4();
	RotateNegative.setRotate(-angle,0,0,1);
	

	

appendPositions([ PupilCenter.elements[0], PupilCenter.elements[1], PupilCenter.elements[2], PupilCenter.elements[3],]);
appendColors([0.0, 0.0, 0.0, 1.0]);
pupilCounter++;
   for(var i = 0; i < count+1; i++){
	    PupilVector = Rotate.multiplyVector4(PupilVector);
		appendPositions([	PupilVector.elements[0], PupilVector.elements[1], PupilVector.elements[2], PupilVector.elements[3], 
						  ]);
		appendColors([
					0.0, 0.0, 1.0, 1.0,     
				  ]); 
				  
		pupilCounter+=1;
   }	

  
appendPositions([ BackOfHeadCenter.elements[0], BackOfHeadCenter.elements[1], BackOfHeadCenter.elements[2], BackOfHeadCenter.elements[3], ]);
appendColors([1.0, 0.0, 0.0, 1.0]);
backOfHeadCounter++;
BackOfHeadVector.printMe();
   for(var i = 0; i < count+1; i++){
		
	    BackOfHeadVector = RotateNegative.multiplyVector4(BackOfHeadVector);
		appendPositions([	BackOfHeadVector.elements[0],  BackOfHeadVector.elements[1],  BackOfHeadVector.elements[2],  BackOfHeadVector.elements[3],  
						  ]);
		appendColors([
					1.0, 0.0, 1.0, 1.0,     
				  ]); 
				  
		backOfHeadCounter++;
   }	
 
  
 var i;
   for( i = 0; i < count+1; i++){
	   BackOfHeadVector = Rotate.multiplyVector4(BackOfHeadVector);
	   FrontOfHeadVector = Rotate.multiplyVector4(FrontOfHeadVector);

		appendPositions([	
							FrontOfHeadVector.elements[0], FrontOfHeadVector.elements[1], FrontOfHeadVector.elements[2], FrontOfHeadVector.elements[3], 
							BackOfHeadVector.elements[0], BackOfHeadVector.elements[1], BackOfHeadVector.elements[2], BackOfHeadVector.elements[3], 
						  ]);
		appendColors([
					0.0, 1.0, 1.0, 1.0,     
					1.0, 0.0, 1.0, 1.0,     
				  ]); 
				  
		sideOfHeadCounter += 2;
   }  
   
   var i;
   for( i = 0; i < count+1; i++){
	    FrontOfHeadVector = Rotate.multiplyVector4(FrontOfHeadVector);
		PupilVector = Rotate.multiplyVector4(PupilVector);
		
		appendPositions([	PupilVector.elements[0], PupilVector.elements[1], PupilVector.elements[2], PupilVector.elements[3], 
							FrontOfHeadVector.elements[0], FrontOfHeadVector.elements[1], FrontOfHeadVector.elements[2], FrontOfHeadVector.elements[3], 
							
						  ]);
		appendColors([
					0.0, 0.0, 1.0, 1.0,     
					1.0, 1.0, 1.0, 1.0,     
				  ]); 
				  
		insideHeadCounter += 2;
   }  
   
	return pupilCounter + backOfHeadCounter + sideOfHeadCounter + insideHeadCounter;
}

function DrawHead(Parent, index){

	var temp = new Matrix4();
	temp.set(Parent);
	temp.rotate(90,1,0,0);
	temp.scale(1.25,1.25,1.25);

	 gl.uniformMatrix4fv(u_ModelMatrix, false, temp.elements);
	if(debug == 0){
		//gl.disable(gl.CULL_FACE);
		gl.drawArrays(gl.TRIANGLE_FAN, index, pupilCounter);
		gl.drawArrays(gl.TRIANGLE_FAN, index+pupilCounter, backOfHeadCounter);
		gl.drawArrays(gl.TRIANGLE_STRIP, index+pupilCounter + backOfHeadCounter, sideOfHeadCounter);
		gl.drawArrays(gl.TRIANGLE_STRIP, index+pupilCounter + backOfHeadCounter + sideOfHeadCounter, insideHeadCounter);
	}
	DrawDebug(temp);
	
}