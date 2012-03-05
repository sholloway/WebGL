Sketch = {}

Sketch.init = function(){
	return Sketch;
}

Sketch.draw = function(gl) {
	for(var index = 0; index < 20; index++ ){
		rectB(random(getWidth()), random(getHeight()), random(400), random(400));
	}
}