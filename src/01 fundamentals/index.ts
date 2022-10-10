/**
 * @doc https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html
 */

import vSahder from './shader/vSahder.glsl';
import fSahder from './shader/fSahder.glsl';

import { Tool } from '../utils/tool';

export function render(gl: WebGLRenderingContext) {
  const vertexShader = Tool.createShader(gl, gl.VERTEX_SHADER, vSahder);
  const fragmentShader = Tool.createShader(gl, gl.FRAGMENT_SHADER, fSahder);

  const program = Tool.createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  console.log('positionAttributeLocation', positionAttributeLocation);

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 三个二维点坐标
  // prettier-ignore
  const positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  Tool.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 清空画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 告诉它用我们之前写好的着色程序（一个着色器对）
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // 将绑定点绑定到缓冲数据（positionBuffer）
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  const size = 2; // 每次迭代运行提取两个单位数据
  const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
  const normalize = false; // 不需要归一化数据
  const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  const offset = 0; // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  const count = 3;
  gl.drawArrays(gl.TRIANGLES, offset, count);
}
