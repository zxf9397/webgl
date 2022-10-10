export class Tool {
  /**
   * 创建着色器
   * @param {WebGLRenderingContext} gl 渲染上下文
   * @param {Number} type 着色器类型
   * @param {String} source 数据源
   * @returns 着色器
   */
  static createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type); // 创建着色器对象

    if (!shader) {
      throw new Error('Failed to create shader');
    }

    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    gl.deleteShader(shader);

    throw new Error(gl.getShaderInfoLog(shader) || 'Failed to get shader parameter');
  }

  /**
   * 创建着色程序
   * @param {WebGLRenderingContext} gl 渲染上下文
   * @param {WebGLShader} vertexShader 顶点着色器
   * @param {WebGLShader} fragmentShader 片元着色器
   * @returns 着色程序
   */
  static createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram();

    if (!program) {
      throw new Error('Failed to create program');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    gl.deleteProgram(program);

    throw new Error(gl.getProgramInfoLog(program) || 'Failed to get program parameter');
  }

  static resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }
}
