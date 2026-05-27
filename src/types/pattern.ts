export type ParamSchema =
  | {
      type: 'number'
      name: string
      label: string
      description?: string
      min: number
      max: number
      step: number
      default: number
    }
  | {
      type: 'select'
      name: string
      label: string
      description?: string
      options: { value: string; label: string }[]
      default: string
    }
  | {
      type: 'boolean'
      name: string
      label: string
      description?: string
      default: boolean
    }

export type ParamValues = Record<string, number | string | boolean>

export interface RendererContext {
  canvas: HTMLCanvasElement
  width: number
  height: number
  params: ParamValues
}

export interface Renderer {
  init(ctx: RendererContext): void
  step(): void
  draw(): void
  setParams(params: ParamValues): void
  reset(): void
  dispose(): void
}

export type RendererFactory = () => Renderer

export interface Pattern {
  id: string
  title: string
  category: string
  blurb: string
  params: ParamSchema[]
  createRenderer: RendererFactory
  explainer: () => Promise<{ default: React.ComponentType }>
  /** Frames per render-tick. 1 = every frame. Higher slows visual but keeps simulation cost bounded. */
  drawEvery?: number
  /** Steps per frame. Lets a pattern "fast-forward" simulation between draws. */
  stepsPerFrame?: number
}
