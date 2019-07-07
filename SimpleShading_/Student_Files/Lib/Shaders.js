var VSHADER_PHONG =

  //Local structure for materials
 'struct MatlT {\n' +		
	'		vec3 emit;\n' +	
	'		vec3 ambi;\n' +	
	'		vec3 diff;\n' +	
	'		vec3 spec;\n' + 
	'		int shiny;\n' +	
  '		};\n' +
  
  'uniform MatlT u_MatlSet[1];\n' +	
  
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  'attribute float a_PointSize;\n' +        

  'void main() {\n' +
  'mat4 totalModelMatrix =  u_MvpMatrix * u_ModelMatrix;\n' +
  'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);\n' +
  'vec3 normVec = normalize(transVec.xyz);\n' +	
  'vec4 offsetPos = a_Position + 0.1*normalize(vec4(a_Normal, 0.0));\n' +
  '  gl_Position = totalModelMatrix * a_Position;\n' +  
//  '  gl_Position = totalModelMatrix * offsetPos;\n' +   
 ' v_Position = vec3(u_ModelMatrix * a_Position);\n' +
 ' v_Normal = normVec;\n' +
 ' v_Color = a_Color;\n' +

 ' gl_PointSize = a_PointSize;\n' +       // OUTPUT:  POINTS drawing prim size 
                                           // (in pixels) for this vertex
  '}\n';

// Fragment Shader source code (GLSL)
var FSHADER_PHONG =
  'precision highp float;\n' +
  'precision highp int;\n' +
  
  'struct MatlT {\n' +		
	'		vec3 emit;\n' +	
	'		vec3 ambi;\n' +	
	'		vec3 diff;\n' +	
	'		vec3 spec;\n' + 
	'		int shiny;\n' +	
  '		};\n' +
  
  'uniform MatlT u_MatlSet[1];\n' +	
  
  'struct LampT {\n' +		
	'	vec3 pos;\n' +		
	' 	vec3 ambi;\n' +		
	' 	vec3 diff;\n' +		
	'	vec3 spec;\n' +		
	'}; \n' +
  
  'uniform LampT u_LampSet[2];\n' +
  
  'uniform vec3 u_EyePoint;\n' +
  
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec4 v_Color;\n' +
  
  'void main() {\n' +
     // Normalize the normal because it is interpolated and not 1.0 in length any more
  '  vec3 normal = normalize(v_Normal);\n' +
     // Calculate the light direction and make it 1.0 in length
  '  vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position);\n' +
     // The dot product of the light direction and the normal
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
     // Calculate the final color from diffuse reflection and ambient reflection
  '  vec3 SurfaceToEye = normalize(u_EyePoint - v_Position.xyz);\n' +
  //Blinn-Phong
  ' vec3 H = normalize(lightDirection + SurfaceToEye);\n' +
  ' float nDotH = max(dot(H, normal), 0.0); \n' +
  ' float specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  //Phong
 /* 'vec3 R = normalize(reflect(lightDirection, normal));\n' +
  'float VDotR = max(dot(SurfaceToEye, R), 0.0);\n' +
  'float specFactorP = pow(VDotR, 40.0);\n' +*/
  
 '  vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL;\n' +
 '  vec3 ambient = u_LampSet[0].ambi*u_MatlSet[0].ambi;\n' +
 '  vec3 specular = u_LampSet[0].spec*specFactorBP* u_MatlSet[0].spec;\n' +
 
 '  lightDirection = normalize(u_LampSet[1].pos - v_Position);\n' +
 '  nDotL = max(dot(lightDirection, normal), 0.0);\n' +

  ' H = normalize(lightDirection + SurfaceToEye);\n' +
  ' nDotH = max(dot(H, normal), 0.0); \n' +
  ' specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
 
 '  diffuse += u_LampSet[1].diff * u_MatlSet[0].diff * nDotL;\n' +
 '  ambient += u_LampSet[1].ambi*u_MatlSet[0].ambi;\n' +
 '  specular += u_LampSet[1].spec*specFactorBP* u_MatlSet[0].spec;\n' +
 
 '  gl_FragColor = vec4(ambient + diffuse + specular + u_MatlSet[0].emit, v_Color.a);\n' +
  '}\n';
  
var VSHADER_GOURAUD =

  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  
  
 'struct MatlT {\n' +		
	'		vec3 emit;\n' +	
	'		vec3 ambi;\n' +	
	'		vec3 diff;\n' +	
	'		vec3 spec;\n' + 
	'		int shiny;\n' +	
  '		};\n' +
  
  'uniform MatlT u_MatlSet[1];\n' +	

  'struct LampT {\n' +		
	'	vec3 pos;\n' +		
	' 	vec3 ambi;\n' +		
	' 	vec3 diff;\n' +		
	'	vec3 spec;\n' +		
	'}; \n' +
  
  'uniform LampT u_LampSet[2];\n' +
  
  'uniform vec3 u_EyePoint;\n' +

  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'attribute float a_PointSize;\n' +     
  
  'varying vec4 v_Color;\n' +
  
  'void main() {\n' +
  
    'mat4 totalModelMatrix =  u_MvpMatrix * u_ModelMatrix;\n' +
    'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);\n' +
    'vec3 normal = normalize(transVec.xyz);\n' +	
    'vec4 offsetPos = a_Position + 0.1*normalize(vec4(a_Normal, 0.0));\n' +
	'vec4 vertexPosition =  totalModelMatrix * a_Position;\n' +  
	'  gl_Position = vertexPosition;\n' + 
  
//LIGHT 0
  
  '  vec3 lightDirection = normalize(u_LampSet[0].pos - vec3(u_ModelMatrix*a_Position));\n' +
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  '  vec3 SurfaceToEye = normalize(u_EyePoint - vec3(u_ModelMatrix*a_Position));\n' +
  //Blinn-Phong
  ' vec3 H = normalize(lightDirection + SurfaceToEye);\n' +
  ' float nDotH = max(dot(H, normal), 0.0); \n' +
  ' float specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  //Phong
  'vec3 R = normalize(reflect(lightDirection, normal));\n' +
  'float VDotR = max(dot(SurfaceToEye, R), 0.0);\n' +
  'float specFactorP = pow(VDotR, 40.0);\n' +
  
 '  vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL;\n' +
 '  vec3 ambient = u_LampSet[0].ambi*u_MatlSet[0].ambi;\n' +
 '  vec3 specular = u_LampSet[0].spec*specFactorBP* u_MatlSet[0].spec;\n' +
 
 '  lightDirection = normalize(u_LampSet[1].pos - vec3(u_ModelMatrix*a_Position));\n' +
 '  nDotL = max(dot(lightDirection, normal), 0.0);\n' +

  ' H = normalize(lightDirection + SurfaceToEye);\n' +
  ' nDotH = max(dot(H, normal), 0.0); \n' +
  ' specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
 
 ' R = normalize(reflect(lightDirection, normal));\n' +
  'VDotR = max(dot(SurfaceToEye, R), 0.0);\n' +
  'specFactorP = pow(VDotR, 40.0);\n' +
 
 ' diffuse += u_LampSet[1].diff * u_MatlSet[0].diff*nDotL;\n' +
 ' ambient += u_LampSet[1].ambi*u_MatlSet[0].ambi;\n' +
 ' specular += u_LampSet[1].spec*specFactorBP* u_MatlSet[0].spec;\n' +


 ' v_Color =  vec4(ambient + diffuse + specular + u_MatlSet[0].emit, a_Color.a);\n' +

 ' gl_PointSize = a_PointSize;\n' +       
 
  '}\n';

// Fragment Shader source code (GLSL)
var FSHADER_GOURAUD =
  'precision highp float;\n' +
  'precision highp int;\n' + 
  'varying vec4 v_Color;\n' +
  'void main() {\n' + 
  '  gl_FragColor = v_Color;\n' +
  '}\n';
 
 
var VSHADER_COMPOUND = 
   'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform float isGouraudShading;\n' +
  'uniform float isPhongLighting;\n' +
  
  
 'struct MatlT {\n' +		
	'		vec3 emit;\n' +	
	'		vec3 ambi;\n' +	
	'		vec3 diff;\n' +	
	'		vec3 spec;\n' + 
	'		int shiny;\n' +	
  '		};\n' +
  
  'uniform MatlT u_MatlSet[1];\n' +	

  'struct LampT {\n' +		
	'	vec3 pos;\n' +		
	' 	vec3 ambi;\n' +		
	' 	vec3 diff;\n' +		
	'	vec3 spec;\n' +		
	'}; \n' +
  
  'uniform LampT u_LampSet[2];\n' +
  
  'uniform vec3 u_EyePoint;\n' +

  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'attribute float a_PointSize;\n' +     
  
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  
  'void main() {\n' +
  
    'mat4 totalModelMatrix =  u_MvpMatrix * u_ModelMatrix;\n' +
    'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 0.0);\n' +
    'vec3 normal = normalize(transVec.xyz);\n' +	
    'vec4 offsetPos = a_Position + 0.1*normalize(vec4(a_Normal, 0.0));\n' +
	'vec4 vertexPosition =  totalModelMatrix * a_Position;\n' +  
	'  gl_Position = vertexPosition;\n' +  
    //' gl_Position = totalModelMatrix*offsetPos;\n' +  
  
//LIGHT 0
  
  '  vec3 lightDirection = normalize(u_LampSet[0].pos - vec3(u_ModelMatrix*a_Position));\n' +
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  '  vec3 SurfaceToEye = normalize(u_EyePoint - vec3(u_ModelMatrix*a_Position));\n' +
  //Blinn-Phong
  ' vec3 H = normalize(lightDirection + SurfaceToEye);\n' +
  ' float nDotH = max(dot(H, normal), 0.0); \n' +
  ' float specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  //Phong
  'vec3 R = normalize(reflect(-lightDirection, normal));\n' +
  'float VDotR = max(dot(SurfaceToEye, R), 0.0);\n' +
  'float specFactorP = pow(VDotR, 40.0);\n' +
  
 '  vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL;\n' +
 '  vec3 ambient = u_LampSet[0].ambi*u_MatlSet[0].ambi;\n' +
 '  vec3 specular;\n'  +
 'if(isPhongLighting > 0.0){specular += u_LampSet[0].spec*specFactorP* u_MatlSet[0].spec;}\n' +
 'else{ specular += u_LampSet[0].spec*specFactorBP* u_MatlSet[0].spec; }\n' +
 
//LIGHT 1 
 
 '  lightDirection = normalize(u_LampSet[1].pos - vec3(u_ModelMatrix*a_Position));\n' +
 '  nDotL = max(dot(lightDirection, normal), 0.0);\n' +

  ' H = normalize(lightDirection + SurfaceToEye);\n' +
  ' nDotH = max(dot(H, normal), 0.0); \n' +
  ' specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  
  'R = normalize(reflect(-lightDirection, normal));\n' +
  'VDotR = max(dot(SurfaceToEye, R), 0.0);\n' +
  'specFactorP = pow(VDotR, 40.0);\n' +
 
 ' diffuse += u_LampSet[1].diff * u_MatlSet[0].diff*nDotL;\n' +
 ' ambient += u_LampSet[1].ambi*u_MatlSet[0].ambi;\n' +
 'if(isPhongLighting > 0.0){specular += u_LampSet[1].spec*specFactorP* u_MatlSet[0].spec;}\n' +
 'else{ specular += u_LampSet[1].spec*specFactorBP* u_MatlSet[0].spec; }\n' +
 
 ' v_Position = vec3(u_ModelMatrix * a_Position);\n' +
 ' v_Normal = normal;\n' +

 'if(isGouraudShading > 0.0){\n' +
 ' v_Color =  vec4(ambient + diffuse + specular + u_MatlSet[0].emit, a_Color.a);\n' +
 '}\n' +
 'else{ v_Color = a_Color;}\n' +
 

 ' gl_PointSize = a_PointSize;\n' +       
 
  '}\n';

var FSHADER_COMPOUND = 
  'precision highp float;\n' +
  'precision highp int;\n' +
  
  
  
  'struct MatlT {\n' +		
	'		vec3 emit;\n' +	
	'		vec3 ambi;\n' +	
	'		vec3 diff;\n' +	
	'		vec3 spec;\n' + 
	'		int shiny;\n' +	
  '		};\n' +
  
  'uniform MatlT u_MatlSet[1];\n' +	
  
  'struct LampT {\n' +		
	'	vec3 pos;\n' +		
	' 	vec3 ambi;\n' +		
	' 	vec3 diff;\n' +		
	'	vec3 spec;\n' +		
	'}; \n' +
  
  'uniform LampT u_LampSet[2];\n' +
  
  'uniform float isGouraudShading;\n' +
  'uniform float isPhongLighting;\n' +
  'uniform vec3 u_EyePoint;\n' +
  
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec4 v_Color;\n' +
  
  'void main() {\n' +
  '  vec3 normal = normalize(v_Normal);\n' +
  '  vec3 SurfaceToEye = normalize(u_EyePoint - v_Position.xyz);\n' +
  
//LIGHT 0
  
  '  vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position);\n' +
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +  
  //Blinn-Phong
  ' vec3 H = normalize(lightDirection + SurfaceToEye);\n' +
  ' float nDotH = max(dot(H, normal), 0.0); \n' +
  ' float specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  //Phong
  'vec3 R = normalize(reflect(-lightDirection, normal));\n' +
  'float VDotR = max(dot(SurfaceToEye, R), 0.0);\n' +
  'float specFactorP = pow(VDotR, 40.0);\n' +
  
 '  vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL;\n' +
 '  vec3 ambient = u_LampSet[0].ambi*u_MatlSet[0].ambi;\n' +
 '  vec3 specular;\n' +
 'if(isPhongLighting > 0.0){specular  += u_LampSet[0].spec*specFactorP* u_MatlSet[0].spec;}\n' +
 'else{ specular += u_LampSet[0].spec*specFactorBP* u_MatlSet[0].spec; }\n' +

//LIGHT 1 
 
 '  lightDirection = normalize(u_LampSet[1].pos - v_Position);\n' +
 '  nDotL = max(dot(lightDirection, normal), 0.0);\n' +

  ' H = normalize(lightDirection + SurfaceToEye);\n' +
  ' nDotH = max(dot(H, normal), 0.0); \n' +
  ' specFactorBP = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
  
  ' R = normalize(reflect(-lightDirection, normal));\n' + 
  ' VDotR = max(dot(SurfaceToEye, R), 0.0);\n' + 
  ' specFactorP = pow(VDotR, 40.0);\n' + 
 
 '  diffuse += u_LampSet[1].diff * u_MatlSet[0].diff * nDotL;\n' +
 '  ambient += u_LampSet[1].ambi*u_MatlSet[0].ambi;\n' +
 'if(isPhongLighting != 0.0){specular += u_LampSet[1].spec*specFactorP* u_MatlSet[0].spec;}\n' +
 'else{ specular += u_LampSet[1].spec*specFactorBP* u_MatlSet[0].spec; }\n' +
 
 'if(isGouraudShading > 0.0){\n' +
	'  gl_FragColor = v_Color;\n' + 
  '}\n' + 
  'else{ gl_FragColor = vec4(ambient + diffuse + specular + u_MatlSet[0].emit, v_Color.a);}\n' +

  '}\n';