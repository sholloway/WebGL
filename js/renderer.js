Renderer = {};

Renderer.init = function(canvas){
	console.assert(canvas != null, "The canvas cannot be null.");
	console.group("Setup the renderer");
	setWidth(canvas.width);
	setHeight(canvas.height);
	this.gl = this.create3DContext(canvas);
	console.assert(this.gl != null, "The WebGL context was not created.");
	setGraphicsContext(this.gl);
	initBuffers();
	console.groupEnd();
}

Renderer.render = function(sketch){	
	sketch.draw();
	drawRectangleBuffer();
}

Renderer.create3DContext = function(canvas, opt_attribs) {
	console.assert(canvas != null, "The canvas cannot be null.");
  	var names = ["webgl", "experimental-webgl"];
  	var context = null;
  	for (var ii = 0; ii < names.length; ++ii) {
    	try {
      		context = canvas.getContext(names[ii], opt_attribs);
    	} catch(e) {			
			console.log("An error occurred while trying to initialize the WebGL context.\n"+e)
			console.log(canvas);
		}
    	if (context) {
      		break;
    	}
  	}
  	return context;
}