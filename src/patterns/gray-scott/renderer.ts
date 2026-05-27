import type { ParamValues, Renderer, RendererContext } from '../../types/pattern'
import { VERT_SRC, UPDATE_FRAG_SRC, DISPLAY_FRAG_SRC } from './shaders'

const SIM_SIZE = 256

export class GrayScottRenderer implements Renderer {
  private gl!: WebGL2RenderingContext
  private updateProg!: WebGLProgram
  private displayProg!: WebGLProgram
  private vao!: WebGLVertexArrayObject
  private texA!: WebGLTexture
  private texB!: WebGLTexture
  private fboA!: WebGLFramebuffer
  private fboB!: WebGLFramebuffer
  private current: 'A' | 'B' = 'A'
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

    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) throw new Error('EXT_color_buffer_float not supported (WebGL2 float textures)')

    this.updateProg = makeProgram(gl, VERT_SRC, UPDATE_FRAG_SRC)
    this.displayProg = makeProgram(gl, VERT_SRC, DISPLAY_FRAG_SRC)
    this.vao = makeFullscreenQuad(gl, this.updateProg)

    const ta = makeFloatTexture(gl, SIM_SIZE)
    const tb = makeFloatTexture(gl, SIM_SIZE)
    this.texA = ta
    this.texB = tb
    this.fboA = makeFBO(gl, ta)
    this.fboB = makeFBO(gl, tb)

    this.reset()
  }

  setParams(params: ParamValues): void {
    this.params = { ...params }
  }

  reset(): void {
    const gl = this.gl
    // Seed: U=1 everywhere, V=0 everywhere, with a noisy patch in the center.
    const data = new Float32Array(SIM_SIZE * SIM_SIZE * 4)
    const cx = SIM_SIZE / 2
    const cy = SIM_SIZE / 2
    const seedRadius = SIM_SIZE / 12
    for (let y = 0; y < SIM_SIZE; y++) {
      for (let x = 0; x < SIM_SIZE; x++) {
        const i = (y * SIM_SIZE + x) * 4
        const dx = x - cx
        const dy = y - cy
        const inSeed = dx * dx + dy * dy < seedRadius * seedRadius
        const u = inSeed ? 0.5 + (Math.random() - 0.5) * 0.1 : 1.0
        const v = inSeed ? 0.25 + (Math.random() - 0.5) * 0.1 : 0.0
        data[i] = u
        data[i + 1] = v
        data[i + 2] = 0
        data[i + 3] = 1
      }
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texA)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SIM_SIZE, SIM_SIZE, gl.RGBA, gl.FLOAT, data)
    gl.bindTexture(gl.TEXTURE_2D, this.texB)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SIM_SIZE, SIM_SIZE, gl.RGBA, gl.FLOAT, data)
    this.current = 'A'
    this.draw()
  }

  step(): void {
    const gl = this.gl
    const srcTex = this.current === 'A' ? this.texA : this.texB
    const dstFbo = this.current === 'A' ? this.fboB : this.fboA

    gl.bindFramebuffer(gl.FRAMEBUFFER, dstFbo)
    gl.viewport(0, 0, SIM_SIZE, SIM_SIZE)
    gl.useProgram(this.updateProg)
    gl.bindVertexArray(this.vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, srcTex)
    gl.uniform1i(gl.getUniformLocation(this.updateProg, 'u_state'), 0)
    gl.uniform2f(gl.getUniformLocation(this.updateProg, 'u_texel'), 1 / SIM_SIZE, 1 / SIM_SIZE)
    gl.uniform1f(gl.getUniformLocation(this.updateProg, 'u_feed'), this.params.feed as number)
    gl.uniform1f(gl.getUniformLocation(this.updateProg, 'u_kill'), this.params.kill as number)
    gl.uniform1f(gl.getUniformLocation(this.updateProg, 'u_du'), this.params.du as number)
    gl.uniform1f(gl.getUniformLocation(this.updateProg, 'u_dv'), this.params.dv as number)
    gl.uniform1f(gl.getUniformLocation(this.updateProg, 'u_dt'), 1.0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    this.current = this.current === 'A' ? 'B' : 'A'
  }

  draw(): void {
    const gl = this.gl
    const srcTex = this.current === 'A' ? this.texA : this.texB
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, this.width, this.height)
    gl.useProgram(this.displayProg)
    gl.bindVertexArray(this.vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, srcTex)
    gl.uniform1i(gl.getUniformLocation(this.displayProg, 'u_state'), 0)
    const palette = this.paletteIndex(this.params.palette as string)
    gl.uniform1i(gl.getUniformLocation(this.displayProg, 'u_palette'), palette)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  private paletteIndex(name: string): number {
    if (name === 'fire') return 1
    if (name === 'mono') return 2
    return 0
  }

  dispose(): void {
    const gl = this.gl
    gl.deleteProgram(this.updateProg)
    gl.deleteProgram(this.displayProg)
    gl.deleteVertexArray(this.vao)
    gl.deleteTexture(this.texA)
    gl.deleteTexture(this.texB)
    gl.deleteFramebuffer(this.fboA)
    gl.deleteFramebuffer(this.fboB)
  }
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`Shader compile error: ${info}\n${src}`)
  }
  return sh
}

function makeProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
  const prog = gl.createProgram()!
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc)
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog)
    gl.deleteProgram(prog)
    throw new Error(`Program link error: ${info}`)
  }
  return prog
}

function makeFullscreenQuad(gl: WebGL2RenderingContext, prog: WebGLProgram): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()!
  gl.bindVertexArray(vao)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const loc = gl.getAttribLocation(prog, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  gl.bindVertexArray(null)
  return vao
}

function makeFloatTexture(gl: WebGL2RenderingContext, size: number): WebGLTexture {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  return tex
}

function makeFBO(gl: WebGL2RenderingContext, tex: WebGLTexture): WebGLFramebuffer {
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('FBO incomplete')
  }
  return fbo
}

export function createGrayScottRenderer(): Renderer {
  return new GrayScottRenderer()
}
