g_last = 0;
HALT_ANIMATION = false;
ARM_MVT_SPEED = 20;
WR_SPEED_Z= 50;
WR_SPEED_X = 40;
WR_SPEED_Y = 25;
ER_SPEED_Y = 25;
ROTATE_SPEED_YAW = 25;
ROTATING_YAW = 0;
ROTATE_SPEED_PITCH = 15;
ROTATING_PITCH = 0;

MOVEMENT_SPEED = 20;
MOVING = 0;

STRAFE_SPEED = 8;
STRAFING = 0;

PAUSE = false;

FINGER_ROTATION_SPEED = 30;

WAVE_DIRECTION = 1;
FINGER_CURL_SPEED = 30;

TREAD_SPEED = 50;

ROBOT_SPEED = 10;

elapsed = 0

QUEUED_ANIM = "None";
CURRENT_ANIM = "None";
ANIMATION_INDEX = 0;

NEW_ARM_LENGTH = 3;
ARM_LENGTHENING_SPEED = 0.5;

function animateWave(max, min) {
//==============================================================================
	//console.log("WAVING");
	//This is the exit animation (return true if finished, false otherwise)
	if(HALT_ANIMATION){
		  //console.log( "Halting: " + WristRotationZ.value);
		  if( ReturnToPositionPerFrame(WristRotationZ, 0, WR_SPEED_Z, 1)& ReturnToPositionPerFrame(WristRotationY, 0, WR_SPEED_Y, 1) & ReturnToPositionPerFrame(ElbowRotationY, 10, ER_SPEED_Y, 1) ){
			console.log("HALTED");
			return true;
		  }
	}
	else{
		ReturnToPositionPerFrame(WristRotationY, -20, WR_SPEED_Y, 1);
		ReturnToPositionPerFrame(ElbowRotationY, -10, ER_SPEED_Y, 1)
		//console.log(WristRotationY.value);
		if(UpperArmJointRotation.value <100){ UpperArmJointRotation.value = (UpperArmJointRotation.value + ARM_MVT_SPEED*elapsed/1000)%360;}

		if(WristRotationZ.value >  max) WAVE_DIRECTION = -WAVE_DIRECTION;
		if(WristRotationZ.value <  min) WAVE_DIRECTION = -WAVE_DIRECTION;
		WristRotationZ.value =  (WristRotationZ.value + WAVE_DIRECTION*WR_SPEED_Z*elapsed/1000)%360;
	}
	return false;
}

function animateThumbsUp(){

	if(HALT_ANIMATION){
		//console.log("ticking");
		if(
		ReturnToPositionPerFrame(WristRotationX, 90, WR_SPEED_X, 1)&
		ReturnToPositionPerFrame(FingerRotation,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(FingerRotationIndex,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotation,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotationIndex,0, FINGER_ROTATION_SPEED,1))
		{return true;}
	}
	else{
		if(
		ReturnToPositionPerFrame(UpperArmJointRotation, 45, ARM_MVT_SPEED, 1)&
		ReturnToPositionPerFrame(WristRotationX, 0, WR_SPEED_X, 1)&
		ReturnToPositionPerFrame(FingerRotation,90, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(FingerRotationIndex,90, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotation,90, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotationIndex,90, FINGER_ROTATION_SPEED,1)){;}
	}
  return false;	
}

function animateFingerGun(){
	
	if(HALT_ANIMATION){
		//console.log("ticking");
		if(
		ReturnToPositionPerFrame(WristRotationX, 90, WR_SPEED_X, 1)&
		ReturnToPositionPerFrame(FingerRotation,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(FingerRotationIndex,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotation,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotationIndex,0, FINGER_ROTATION_SPEED,1))
		{return true;}
	}
	else{
		if(
		ReturnToPositionPerFrame(UpperArmJointRotation, 45, ARM_MVT_SPEED, 1)&
		ReturnToPositionPerFrame(WristRotationX, 0, WR_SPEED_X, 1)&
		ReturnToPositionPerFrame(FingerRotation,90, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(FingerRotationIndex,0, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotation,90, FINGER_ROTATION_SPEED,1)&
		ReturnToPositionPerFrame(LowerFingerRotationIndex,0, FINGER_ROTATION_SPEED,1)){;}
	}
  return false;	
}


function animateYaw(){
	if(elapsed< 1000){
		var Rotate = new Matrix4();
		
		Yaw = (Yaw + ROTATING_YAW *elapsed/1000*ROTATE_SPEED_YAW)%360;
		Rotate.setRotate(Yaw, 0, 0, 1);
		Rotate.rotate(Pitch, 0 , -1 ,0);
		LookAt = new Vector4([1,0,0,0]);
		LookAt = Rotate.multiplyVector4(LookAt);
		if(ROTATING_YAW != 0){
			//console.log("Yaw: " + Yaw);
		}
		//console.log(ROTATING + " Global Rotation: " + GlobalRotation.value);
		ROTATING_YAW = 0;
	}
	
}
function animatePitch(){
	if(elapsed< 1000){
		var Rotate = new Matrix4();
		if( (Pitch < 80  ||  ROTATING_PITCH <  0) && (ROTATING_PITCH > 0 || Pitch > -80)){
			Pitch +=  ROTATING_PITCH *elapsed/1000*ROTATE_SPEED_PITCH;
		}
		Rotate.setRotate(Yaw, 0, 0, 1);
		Rotate.rotate(Pitch, 0 , -1 ,0);
		LookAt = new Vector4([1,0,0,0]);
		LookAt = Rotate.multiplyVector4(LookAt);
		if(ROTATING_PITCH != 0){
			//console.log("Pitch: " + Pitch);
		}
		
		ROTATING_PITCH = 0;
	}
	
}

function animateCameraMovement(){
	if(elapsed < 1000){
		var factor = elapsed/1000*MOVEMENT_SPEED*MOVING;
		Center = new Vector4([Center.elements[0] + LookAt.elements[0]*factor,
					Center.elements[1] + LookAt.elements[1]*factor,
					Center.elements[2] + LookAt.elements[2]*factor,
					Center.elements[3] + LookAt.elements[3]*factor,]);
		MOVING = 0;
	}
}

function animateCameraStrafe(){
	if(elapsed < 1000){
		var factor = elapsed/1000*STRAFE_SPEED*STRAFING;
		var Rotate = new Matrix4();
		Rotate.setRotate(Yaw,0,0,1);
		Rotate.rotate(Pitch, 0 ,-1, 0);
		Rotate.rotate(90, 0, 0, 1);
		var Perp = new Vector4([1,0,0,0]);
		var Perp = Rotate.multiplyVector4(Perp);
		Center = new Vector4([Center.elements[0] + Perp.elements[0]*factor,
					Center.elements[1] + Perp.elements[1]*factor,
					Center.elements[2] + Perp.elements[2]*factor,
					Center.elements[3] + Perp.elements[3]*factor,]);
		STRAFING = 0;
	}
}
	
function animateTreads(){
	currentTreadAngle.value = (currentTreadAngle.value +  elapsed/1000*TREAD_SPEED)%360;
}

function animateRobotRotation(){
	RobotRotation.value = (RobotRotation.value + elapsed/1000*ROBOT_SPEED)%360;
}
function StartAnimation(Anim){

  switch(Anim){
	case "Wave":
		tickWave();	
		break;
	
	case "ThumbsUp":
		tickThumbsUp();
		break;
	
	case "FingerGun":
		tickFingerGun();
		break;
		
	case "SpinTop":
		tickTop();
		break;
		
	default:
		break;
  }
}

tickWave = function() {
	if(animateWave(30,-30)){
		HALT_ANIMATION = false;
		CURRENT_ANIM = QUEUED_ANIM;
		return;
	}
  };
  
  
tickThumbsUp = function() {
	
	if(animateThumbsUp()){
		HALT_ANIMATION = false;
		CURRENT_ANIM = QUEUED_ANIM;
		return;
	}
  };
  
tickFingerGun = function() {
	
	if(animateFingerGun()){
		HALT_ANIMATION = false;
		CURRENT_ANIM = QUEUED_ANIM;
		return;
	}
  };
  
 function StopAnimations(){
	 HALT_ANIMATION = true;
	 QUEUED_ANIM = "None";
 }
 
 
function QueueAnimation(AnimationName){
	if(CURRENT_ANIM == "None"){
		CURRENT_ANIM = AnimationName;
	}
	else{ 
		HALT_ANIMATION = true;
		QUEUED_ANIM = AnimationName;
	}
 }	
 
 
 function AllAnimations(){
	var now = Date.now();
	elapsed = now - g_last;
	g_last = now;
	if(!PAUSE){
		StartAnimation(CURRENT_ANIM);
		
		animateTreads();
		animateRobotRotation();
	}
	animateYaw();
	animatePitch();
	animateCameraMovement();
	animateCameraStrafe();
	DrawAll();

	requestAnimationFrame(AllAnimations, canvas);
 }
 
 function ReturnToPositionPerFrame(Quantity, Position, Speed, Margin){
	//console.log("Quantity: " + Quantity.value + " Position: " + Position);
	if(Quantity.value > Position - Margin && Quantity.value < Position + Margin){ return true;}
	if(Quantity.value > Position + Margin){ Quantity.value =  (Quantity.value - Speed*elapsed/1000)%360;}
	else if(Quantity.value < Position - Margin){ Quantity.value =  (Quantity.value + Speed*elapsed/1000)%360;}
	return false;
 }
 
 function pause(){PAUSE = !PAUSE;}