/*
The desired API:
2D
	circle(x,y,r)
	rect(x,y,width,height)
	rect_mode(mode)	
	ellipse()
	text(msg, x,y)
	load(model_name)
	load(texture_name)
	load(shader_name)
	perlin(seed)
	fill(color)
	fill(material)
	fill(texture)
	stroke(color)
	program(name)
	show_direction
	background(color)
	font(font_type)

Color


Math
	random(range)
	noise
	
Design Considerations:
	- Should hide the existance of OpenGL
	- Should be efficient in the loading of shaders.
		Check to see if the shader is already loaded. If not, load it.
		
*/
////////////////////////////////////////////////////////////////////////////////////////////
/*enabling methods. Not part of drawing API. Designed for internal use or by the Renderer*/
function setGraphicsContext(gl){
	this.gl = gl;
}

function getGraphicsContext(){
	return this.gl;
}


function initBuffers(){
	var gl = getGraphicsContext();
	console.assert(gl != null, "The Graphics Context was not initialized.")
	this.buffers = {rect_buffer: gl.createBuffer(), 
		rect_vertices:[], 
		rect_colors:[] 
		};
}

function drawRectangleBuffer(){
	console.group("drawRectangleBuffer");
	var gl = getGraphicsContext();
	
	// setup GLSL program  
	var program = ShaderUtils.addShaderProg(gl, 'rect.vert', 'rgba_color.fragment');  
	gl.useProgram(program);

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	var colorLocation = gl.getAttribLocation(program, "a_vertex_color");
	
	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	

	// set the resolution
	gl.uniform2f(resolutionLocation, getWidth(), getHeight());

	// Create a vertex buffer.
	rect_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rect_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.buffers.rect_vertices), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);	

	//Create a buffer for the triangle colors	
	colors = this.buffers.rect_colors;
	//console.log("The color buffer: "+colors);
	/*var colors = [
	    1.0,  1.0,  1.0,  1.0,    // white
	    1.0,  0.0,  0.0,  1.0,    // red
	    0.0,  1.0,  0.0,  1.0,    // green
	    0.0,  0.0,  1.0,  1.0     // blue
	  ];
	*/
	var color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 	
	gl.enableVertexAttribArray(colorLocation);
	gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);	
	
	
	// Draw the rectangle.
	//gl.drawArrays(gl.TRIANGLES, 0, (this.buffers.rect_vertices/2));
	console.log("# of verticies: "+this.buffers.rect_vertices.length/2)
	gl.drawArrays(gl.TRIANGLES, 0, this.buffers.rect_vertices.length/2);
	console.groupEnd();
}

// Fill the buffer with the values that define a rectangle.
// For internal API use only
function setRectangle(gl, x, y, width, height) {
	var x1 = x;
  	var x2 = x + width;
	var y1 = y;
	var y2 = y + height;

	//need to append to this rather than overwrite it every time.
	//also, I think I need to change the shader to store the color values here, 
	//to support rendering multiple rectangles at a time.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	   x1, y1,
	   x2, y1,
	   x1, y2,
	   x1, y2,
	   x2, y1,
	   x2, y2]), gl.STATIC_DRAW);
}

/*
I want my data structure to be:
struct Rectangle{
	float points[12]
	float color[4]
}
*/
function setRectangleB(gl, x, y, width, height) {
	var x1 = x;
  	var x2 = x + width;
	var y1 = y;
	var y2 = y + height;
	
	
	this.buffers.rect_vertices.push(x1, y1, 
	   x2, y1,
	   x1, y2,
	   x1, y2,
	   x2, y1,
	   x2, y2);	
/*	
	var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

	this.buffers.rect_vertices.push(x1, y1, 
		x2, y1,
		x1, y2,
		x2, y2);
		*/
}
function setWidth(width){
	this.Width = width;
}

function setHeight(height){	
	this.Height = height;
}

function getWidth(){
	console.assert(this.Width != null, "The width was not set by the renderer.")
	return this.Width;
}

function getHeight(){
	console.assert(this.Height != null, "The height was not set by the renderer.")
	return this.Height;
}
////////////////////////////////////////////////////////////////////////////////////////////
/* Graphical Methods. Use inside of a sketch.*/


function rect(x,y,width, height){		
	var gl = getGraphicsContext();
	// setup GLSL program  
	var program = ShaderUtils.addShaderProg(gl, 'rect.vert', 'rgba_color.fragment');  
	gl.useProgram(program);

	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");

	// lookup uniforms
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	var colorLocation = gl.getUniformLocation(program, "u_color");

	// set the resolution
	gl.uniform2f(resolutionLocation, getWidth(), getHeight());

	// Create a buffer.
	//var buffer = gl.createBuffer();
	rect_buffer = this.buffers.rect_buffer;
	gl.bindBuffer(gl.ARRAY_BUFFER, rect_buffer);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	 // Setup a random rectangle
	 setRectangle(gl, x, y, width, height);

	 // Set a random color.
	 gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

	 // Draw the rectangle.
	 gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function rectB(x,y,width, height){	
	//save the current fill color per vertex
	var red = Math.random();
	var blue = Math.random();
	var green = Math.random();
	this.buffers.rect_colors.push(red, blue, green, 1);
	this.buffers.rect_colors.push(red, blue, green, 1);
	this.buffers.rect_colors.push(red, blue, green, 1);
	
	this.buffers.rect_colors.push(red, blue, green, 1);
	this.buffers.rect_colors.push(red, blue, green, 1);
	this.buffers.rect_colors.push(red, blue, green, 1);
	
	setRectangleB(gl, x, y, width, height);
}

////////////////////////////////////////////////////////////////////////////////////////////
/* Mathmatical helpers */

// Returns a random integer from 0 to range - 1.
function random(range) {
  return Math.floor(Math.random() * range);
}