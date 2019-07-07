FingerRotation = {'value' : 0};
FingerRotationIndex = {'value' : 0};
LowerFingerRotation = {'value' : 0};
LowerFingerRotationIndex = {'value' : 0};

ElbowRotationY = {'value' : 10};

WristRotationX = {'value' : 90}; //Palm up v Palm down
WristRotationY = {'value' : 0}; //Up/Down
WristRotationZ = {'value' : 0};  //Side to Side


UpperArmJointRotation = {'value' : 0};
UpperArmLength = {'value': 3};


function DrawArm(Parent, Chirality){
	
	var Orientation;
	if(Chirality == 'R'){ Orientation = -1;}
	else if(Chirality == 'L'){ Orientation = 1;}
	else{ console.log("Invalid Argument"); return;}
	
	var temp = new Matrix4();
	temp.set(Parent);
	
	//Shoulder Joint
	
	temp.rotate(Orientation*20,1,0,0);
	temp.translate(0,0,-Orientation*0.1);
	temp.rotate(-45,0,0,1);
	DrawDebug(temp);

		
		//Upper Arm 
		temp.translate(1,0,0);
		
		temp.scale(UpperArmLength.value,1,1);
		DrawCylinder(temp, cylinderIndex, MATL_OBSIDIAN);
		
			
			//Elbow Joint
			temp.translate(0.45,0,0);
			temp.scale(1/UpperArmLength.value,1,1);
			temp.rotate(UpperArmJointRotation.value,0,0,1);
			temp.rotate(-Orientation*ElbowRotationY.value,0,1,0);
			DrawDebug(temp);
				
				
				temp.translate(1.12,0,0);
				temp.rotate(-90,0,1,0);
				DrawPara(temp, longIndex, MATL_SILVER_SHINY);
				
					
					temp.rotate(90,0,1,0);
					temp.rotate(180,1,0,0);
					temp.translate(1,0,0);
					//console.log(WristRotationX.value +", " + WristRotationY.value + ", " + WristRotationZ.value);
					if(Chirality == 'R'){
						temp.rotate(-WristRotationX.value, 1, 0 ,0);
						temp.rotate(-WristRotationY.value, 0, 1 ,0);
					}
					if(Chirality == 'L'){
						temp.rotate(WristRotationX.value, 1, 0 ,0);
						temp.rotate(WristRotationY.value, 0, 1 ,0);
					}
					
					temp.rotate(WristRotationZ.value, 0, 0 ,1);
					DrawDebug(temp);
					
						
						temp.scale(0.75,0.75,0.75);
						temp.translate(1,0,0);
						temp.rotate(90,0,1,0);
						temp.rotate(50,1,0,0);
						pushMatrix(temp);
							temp.scale(0.35, 0.9, 1.0);
							DrawSphere(temp, sphereIndex, MATL_OBSIDIAN);
						temp = popMatrix();
								
							//Little Finger
							pushMatrix(temp);
							temp.translate(0,1,0);
							temp.rotate(-36,1,0,0);
							temp.rotate(-90,0,1,0);
							temp.rotate(20,0,0,1);
							temp.translate(-0.2,0.05,0);
							temp.rotate(Orientation*FingerRotation.value,0,1,0);
							temp.scale(0.4,0.375,0.5);
							DrawFinger(temp,Orientation*LowerFingerRotation.value, MATL_RED_PLASTIC, MATL_OBSIDIAN);
							temp = popMatrix();
							
							pushMatrix(temp);
							temp.translate(0,1,0);
							temp.rotate(-36,1,0,0);
							temp.rotate(-90,0,1,0);
							temp.rotate(20,0,0,1);
							temp.translate(-0.2,-0.45,0);
							temp.rotate(Orientation*FingerRotation.value,0,1,0);
							temp.scale(0.5,0.5,0.5);
							DrawFinger(temp, Orientation*LowerFingerRotation.value, MATL_RED_PLASTIC, MATL_OBSIDIAN);
							temp = popMatrix();
							
							pushMatrix(temp);
							temp.translate(0,1,0);
							temp.rotate(-36,1,0,0);
							temp.rotate(-90,0,1,0);
							temp.rotate(20,0,0,1);
							temp.translate(-0.2,-0.95,0);
							temp.rotate(Orientation*FingerRotation.value,0,1,0);
							temp.scale(0.55,0.5,0.5);
							DrawFinger(temp,Orientation*LowerFingerRotation.value,  MATL_RED_PLASTIC, MATL_OBSIDIAN);
							temp = popMatrix();
							
							pushMatrix(temp)
							temp.translate(0,1,0);
							temp.rotate(-36,1,0,0);
							temp.rotate(-90,0,1,0);
							temp.rotate(20,0,0,1);
							temp.translate(-0.5,-1.4,0);
							temp.rotate(Orientation*FingerRotationIndex.value,0,1,0);
							temp.scale(0.5,0.45,0.5);
							DrawFinger(temp,Orientation*LowerFingerRotationIndex.value, MATL_RED_PLASTIC, MATL_OBSIDIAN);
							temp = popMatrix();
							
							pushMatrix(temp);
							temp.translate(0,-0.8,0);
							temp.rotate(-50,1,0,0);
							temp.rotate(-90,0,1,0);
							temp.rotate(-50,0,0,1);
							temp.scale(0.5,0.5,0.5);
							DrawFinger(temp,0,  MATL_RED_PLASTIC, MATL_OBSIDIAN);
							temp = popMatrix();
							
						
					
				
			
		
	  
//*********** HIERARCHY END ************//
	
  
}

function DrawFinger(Parent, rotation, mat1, mat2){
	
	if(mat1){
		updateMaterial(mat1);
	}
	
	Parent.scale(1.5,0.75,0.75);
	Parent.translate(0.5,0,0);
	DrawPara(Parent,cubeIndex);
	
		if(mat2){
			updateMaterial(mat2);
		}	
		
		Parent.translate(0.5,0,0);
		Parent.scale(0.5,1,1);
		Parent.rotate(rotation,0,1,0);
		//console.log("Drawing Debug");
		DrawDebug(Parent);
			
			Parent.translate(1.1,0,0);
			Parent.scale(0.8,1,1);
			Parent.rotate(-90,0,1,0);
			DrawPara(Parent, longIndex);
				
	

}
