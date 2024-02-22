var projectionMatrix, modelViewMatrix;
var shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

function createCube(gl) {
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var verts = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  
  // Color data
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var faceColors = [
    [1.0, 0.0, 0.0, 1.0], // Front face
    [0.0, 1.0, 0.0, 1.0], // Back face
    [0.0, 0.0, 1.0, 1.0], // Top face
    [1.0, 1.0, 0.0, 1.0], // Bottom face
    [1.0, 0.0, 1.0, 1.0], // Right face
    [0.0, 1.0, 1.0, 1.0] // Left face]
  ];
  // vertex color: [[color point0 face0],[color point1 face0],[]..., [color point3 face 5]]
  for (var i in faceColors) {
    var color = faceColors[i];
    for (var j=0; j<4; j++) {
      vertexColors = vertexColors.concat(color);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

  // Index data, defines the triangles to be drawn
  
}


function initMatrices(canvas) {
  // Model view matrix with camera at 0,0,-3.333
  modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [0,0,-3.333]);
  // Projection matrix with 45 degree FOV
  projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, Math.PI/4, canvas.offsetWidth/canvas.offsetHeight, 1, 10000);
}

function createShader(gl, str, type) {
  var shader;
  if (type == "fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type == "vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
      return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
  }

  return shader;
}

var vertexShaderSource =

"    attribute vec3 vertexPos;\n" +
"    uniform mat4 modelViewMatrix;\n" +
"    uniform mat4 projectionMatrix;\n" +
"    void main(void) {\n" +
"		// Return the transformed and projected vertex value\n" +
"        gl_Position = projectionMatrix * modelViewMatrix * \n" +
"            vec4(vertexPos, 1.0);\n" +
"    }\n";

var fragmentShaderSource = 
"    void main(void) {\n" +
"    // Return the pixel color: always output white\n" +
  "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
"}\n";

function initShader(gl) {

  // load and compile the fragment and vertex shader
  //var fragmentShader = getShader(gl, "fragmentShader");
  //var vertexShader = getShader(gl, "vertexShader");
  var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
  var vertexShader = createShader(gl, vertexShaderSource, "vertex");

  // link them together into a new program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // get pointers to the shader params
  shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
  gl.enableVertexAttribArray(shaderVertexPositionAttribute);
  
  shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
  shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
  }
}

function draw(gl, obj) {

  // clear the background (with black)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set the shader to use
  gl.useProgram(shaderProgram);

  // connect up the shader parameters: vertex position and projection/model matrices
  // set the vertex buffer to be drawn
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
  gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

  // draw the object
  gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

var canvas = document.getElementById("webglcanvas");
var gl = canvas.getContext("webgl"); 
gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight);
initMatrices(canvas);
var square = createSquare(gl);
initShader(gl);
draw(gl, square);
