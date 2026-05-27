import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_pos;
void main(){ v_pos = a_pos; gl_Position = vec4(a_pos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
in vec2 v_pos;
out vec4 outColor;
uniform vec2 u_center;
uniform float u_zoom;
uniform float u_aspect;
uniform int u_maxIter;
uniform int u_degree;
uniform float u_relax;

vec2 cmul(vec2 a, vec2 b){ return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b){
  float denom = b.x*b.x + b.y*b.y;
  return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / denom;
}
vec2 cpow(vec2 z, int n){
  vec2 r = vec2(1.0, 0.0);
  for(int i = 0; i < 16; i++){
    if(i >= n) break;
    r = cmul(r, z);
  }
  return r;
}

void main(){
  vec2 z = u_center + vec2(v_pos.x * u_aspect, v_pos.y) / u_zoom;
  int iter = 0;
  bool done = false;
  for(int i = 0; i < 256; i++){
    if(i >= u_maxIter) break;
    vec2 zn = cpow(z, u_degree);
    vec2 fz = zn - cmul(z, vec2(1.0, 0.0)) + zn - vec2(1.0, 0.0); // placeholder, replaced below
    // f(z) = z^n - 1, f'(z) = n*z^(n-1)
    fz = cpow(z, u_degree) - vec2(1.0, 0.0);
    vec2 fpz = vec2(float(u_degree), 0.0);
    vec2 zp = cpow(z, u_degree - 1);
    fpz = cmul(fpz, zp);
    vec2 step = cdiv(fz, fpz);
    z = z - u_relax * step;
    if(dot(step, step) < 1e-8){ iter = i; done = true; break; }
    iter = i;
  }
  // Identify root by angle (n-th roots of unity).
  float angle = atan(z.y, z.x);
  if(angle < 0.0) angle += 6.2831853;
  float rootIdx = floor(angle * float(u_degree) / 6.2831853 + 0.5);
  rootIdx = mod(rootIdx, float(u_degree));
  float hue = rootIdx / float(u_degree);
  // Convergence speed: brighter = faster.
  float speed = 1.0 - float(iter) / float(u_maxIter);
  speed = pow(speed, 0.6);
  if(!done) speed *= 0.5;
  vec3 col = 0.5 + 0.5 * cos(6.2831 * (hue + vec3(0.0, 0.33, 0.67)));
  col = col * (0.25 + 0.75 * speed);
  outColor = vec4(col, 1.0);
}`

export class NewtonRenderer implements Renderer {
  private gl!: WebGL2RenderingContext
  private prog!: WebGLProgram
  private vao!: WebGLVertexArrayObject
  private params!: ParamValues
  private width = 0
  private height = 0

  init(ctx: RendererContext): void {
    const gl = ctx.canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true })
    if (!gl) throw new Error('WebGL2 not supported')
    this.gl = gl
    this.width = ctx.width
    this.height = ctx.height
    this.params = { ...ctx.params }
    this.prog = makeProgram(gl, VERT, FRAG)
    this.vao = makeQuad(gl, this.prog)
    this.draw()
  }

  setParams(params: ParamValues): void {
    this.params = { ...params }
    this.draw()
  }

  reset(): void {
    this.draw()
  }

  step(): void {}

  draw(): void {
    const gl = this.gl
    gl.viewport(0, 0, this.width, this.height)
    gl.useProgram(this.prog)
    gl.bindVertexArray(this.vao)
    gl.uniform2f(
      gl.getUniformLocation(this.prog, 'u_center'),
      this.params.cx as number,
      this.params.cy as number,
    )
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_zoom'), this.params.zoom as number)
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_aspect'), this.width / this.height)
    gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maxIter'), this.params.iterations as number)
    gl.uniform1i(gl.getUniformLocation(this.prog, 'u_degree'), this.params.degree as number)
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_relax'), this.params.relaxation as number)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  dispose(): void {
    this.gl.deleteProgram(this.prog)
    this.gl.deleteVertexArray(this.vao)
  }
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? 'shader error')
  }
  return sh
}

function makeProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs))
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? 'link error')
  }
  return p
}

function makeQuad(gl: WebGL2RenderingContext, prog: WebGLProgram): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()!
  gl.bindVertexArray(vao)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  gl.bindVertexArray(null)
  return vao
}

export function createNewtonRenderer(): Renderer {
  return new NewtonRenderer()
}
