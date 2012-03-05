function scene(doc) {
  // Get A WebGL context
  var canvas = doc.getElementById("canvas");
  if (canvas == null){
	alert("canvas could not be found");
  }
  var gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }

  // setup GLSL program
  //vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
  //fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
  //program = createProgram(gl, [vertexShader, fragmentShader]);
  var program = ShaderUtils.addShaderProg(gl, 'rect.vert', 'rgba_color.fragment');  
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // set the resolution
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  // Create a buffer.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // draw 50 random rectangles in random colors
  for (var ii = 0; ii < 50; ++ii) {
    // Setup a random rectangle
    setRectangle(gl, randomInt(canvas.width), randomInt(canvas.height), randomInt(300), randomInt(300));

    // Set a random color.
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}