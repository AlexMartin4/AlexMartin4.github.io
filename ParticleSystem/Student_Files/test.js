function newGrid(){
	var temp =  new GridBox(50, 50, 20);
	console.log(temp);
	//temp.init();
	return temp;
}

function Float32Edit(base,edit,startIdx){
  for(var i = 0; i < edit.length;i++){
    base[i+startIdx] = edit[i];
  }
  return base;
}