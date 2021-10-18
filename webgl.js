function initWebGL(canvas) {
  let gl = null;
  let msg = 'Your browser does not support WebGL, ' + 'or it is not enabled by default.';
  try {
    gl = canvas.getContext('experimental-webgl');
  } catch (e) {
    msg = 'Error creating WebGL Context!: ' + e.toString();
  }
  if (!gl) {
    alert(msg);
    throw new Error(msg);
  }
  return gl;
}

function initViewport(gl, canvas) {
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function createSquare(gl) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const verts = [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  return { buffer: vertexBuffer, vertSize: 3, nVerts: 4, primtype: gl.TRIANGLE_STRIP };
}

let projectionMatrix, modelViewMatrix;
function initMatrices(canvas) {
  modelViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);
  projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
}

function createShader(gl, str, type) {
  let shader;
  if (type == 'fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type == 'vertex') {
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

const vertexShaderSource = `
  attribute vec3 vertexPos;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  void main(void) {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
  }
`;

const fragmentShaderSource = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

let shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;
function initShader(gl) {
  const fragmentShader = createShader(gl, fragmentShaderSource, 'fragment');
  const vertexShader = createShader(gl, vertexShaderSource, 'vertex');
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertexPos');
  gl.enableVertexAttribArray(shaderVertexPositionAttribute);
  shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Could not initialise shaders');
  }
}

function draw(gl, obj) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

  gl.useProgram(shaderProgram);

  gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

  gl.drawArrays(obj.primtype, 0, obj.nVerts);
}
