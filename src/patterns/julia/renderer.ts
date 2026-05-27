import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_pos;
void main(){ v_pos = a_pos; gl_Position = vec4(a_pos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
in vec2 v_pos;
out vec4 outColor;
uniform vec2 u_c;
uniform float u_zoom;
uniform float u_aspect;
uniform int u_maxIter;
uniform int u_palette;

vec3 paletteGalaxy(float t){
  vec3 a = vec3(0.02, 0.02, 0.08);
  vec3 b = vec3(0.30, 0.10, 0.50);
  vec3 c = vec3(0.85, 0.30, 0.85);
  vec3 d = vec3(1.0, 1.0, 1.0);
  if(t < 0.4) return mix(a, b, t / 0.4);
  if(t < 0.8) return mix(b, c, (t - 0.4) / 0.4);
  return mix(c, d, (t - 0.8) / 0.2);
}
vec3 paletteForest(float t){
  vec3 a = vec3(0.02, 0.05, 0.02);
  vec3 b = vec3(0.10, 0.40, 0.20);
  vec3 c = vec3(0.85, 0.95, 0.30);
  if(t < 0.5) return mix(a, b, t * 2.0);
  return mix(b, c, (t - 0.5) * 2.0);
}
vec3 paletteRainbow(float t){
  return 0.5 + 0.5 * cos(6.2831 * (t + vec3(0.0, 0.33, 0.67)));
}

void main(){
  vec2 z = vec2(v_pos.x * u_aspect, v_pos.y) / u_zoom;
  vec2 c = u_c;
  int n = 0;
  float esc = 0.0;
  for(int i = 0; i < 1024; i++){
    if(i >= u_maxIter) break;
    float xt = z.x*z.x - z.y*z.y + c.x;
    z.y = 2.0 * z.x * z.y + c.y;
    z.x = xt;
    if(dot(z, z) > 256.0){ esc = float(i) - log2(log2(dot(z, z))) + 4.0; n = i; break; }
    n = i;
  }
  if(n >= u_maxIter - 1){ outColor = vec4(0.02, 0.02, 0.04, 1.0); return; }
  float t = pow(esc / float(u_maxIter), 0.5);
  vec3 col;
  if(u_palette == 0) col = paletteGalaxy(t);
  else if(u_palette == 1) col = paletteForest(t);
  else col = paletteRainbow(t);
  outColor = vec4(col, 1.0);
}`

export class JuliaRenderer implements Renderer {
  private gl!: WebGL2RenderingContext
  private prog!: WebGLProgram
  private vao!: WebGLVertexArrayObject
  private params!: ParamValues
  private width = 0
  private height = 0
  private t = 0

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
    this.t = 0
    this.draw()
  }

  step(): void {
    if (this.params.animate) {
      this.t += 0.005
      this.draw()
    }
  }

  draw(): void {
    const gl = this.gl
    gl.viewport(0, 0, this.width, this.height)
    gl.useProgram(this.prog)
    gl.bindVertexArray(this.vao)
    let cx = this.params.cx as number
    let cy = this.params.cy as number
    if (this.params.animate) {
      const r = 0.7885
      cx = r * Math.cos(this.t)
      cy = r * Math.sin(this.t)
    }
    gl.uniform2f(gl.getUniformLocation(this.prog, 'u_c'), cx, cy)
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_zoom'), this.params.zoom as number)
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_aspect'), this.width / this.height)
    gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maxIter'), this.params.iterations as number)
    const pal = this.params.palette === 'galaxy' ? 0 : this.params.palette === 'forest' ? 1 : 2
    gl.uniform1i(gl.getUniformLocation(this.prog, 'u_palette'), pal)
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

export function createJuliaRenderer(): Renderer {
  return new JuliaRenderer()
}
