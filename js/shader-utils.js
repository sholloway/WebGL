ShaderUtils = {};

ShaderUtils.allShaders = {};
ShaderUtils.SHADER_TYPE_FRAGMENT = "x-shader/x-fragment";
ShaderUtils.SHADER_TYPE_VERTEX = "x-shader/x-vertex";

ShaderUtils.addShaderProg = function (gl, vertex, fragment) {
	console.group("addShaderProg")
	console.log('Beginning to create a shader program')
    ShaderUtils.loadShader(vertex, ShaderUtils.SHADER_TYPE_VERTEX);
    ShaderUtils.loadShader(fragment, ShaderUtils.SHADER_TYPE_FRAGMENT);

    var vertexShader = ShaderUtils.getShader(gl, vertex);
	console.log('Vertex Shader')
	console.log(vertexShader)
    var fragmentShader = ShaderUtils.getShader(gl, fragment);
	console.log('Fragment Shader')
	console.log(fragmentShader)

    var prog = gl.createProgram();
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
	console.log("about to link the program")
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {alert("Could not initialise the shaders: "+vertex+", "+fragment);}
	console.groupEnd();
    return prog;
};

ShaderUtils.loadShader = function(file, type) {
	console.log('fetch the file:'+file)
    var cache, shader;

    $.ajax({
        async: false, // need to wait... todo: deferred?
        url: "shaders/" + file, //todo: use global config for shaders folder?
		dataType: "text",
        success: function(result) {
		   console.group("file load")
		   console.log("got the file")
		   console.log(result)
		   console.groupEnd()
           cache = {script: result, type: type};
        }
    });

    // store in global cache
    ShaderUtils.allShaders[file] = cache;
};

ShaderUtils.getShader = function (gl, id) {
	console.group("getShader: "+id)
    //get the shader object from our main.shaders repository
    var shaderObj = ShaderUtils.allShaders[id];
	console.log('shaderObj: '+shaderObj)
    var shaderScript = shaderObj.script;
	console.log('shaderScript: '+shaderScript)
    var shaderType = shaderObj.type;

    //create the right shader
    var shader;
    if (shaderType == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderType == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    //wire up the shader and compile
    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    //if things didn't go so well alert
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

	console.groupEnd()
    //return the shader reference
    return shader;

};//end:getShader