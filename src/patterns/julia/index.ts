import type { Pattern } from '../../types/pattern'
import { createJuliaRenderer } from './renderer'

export const julia: Pattern = {
  id: 'julia',
  title: 'Julia Set',
  category: 'Fractals',
  blurb:
    'Sister fractal to the Mandelbrot set. Same iteration z ↦ z² + c, but c is fixed and z varies — the boundary morphs as you slide c around.',
  params: [
    {
      type: 'number',
      name: 'cx',
      label: 'c.real',
      min: -1.5,
      max: 1.5,
      step: 0.001,
      default: -0.7,
    },
    {
      type: 'number',
      name: 'cy',
      label: 'c.imag',
      min: -1.5,
      max: 1.5,
      step: 0.001,
      default: 0.27015,
    },
    {
      type: 'number',
      name: 'zoom',
      label: 'zoom',
      min: 0.3,
      max: 8,
      step: 0.05,
      default: 0.7,
    },
    {
      type: 'number',
      name: 'iterations',
      label: 'max iterations',
      min: 50,
      max: 800,
      step: 10,
      default: 200,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'galaxy', label: 'Galaxy' },
        { value: 'forest', label: 'Forest' },
        { value: 'rainbow', label: 'Rainbow' },
      ],
      default: 'galaxy',
    },
    {
      type: 'boolean',
      name: 'animate',
      label: 'orbit c',
      description: 'Sweep c around a circle of radius 0.7885 — produces a hypnotic morph.',
      default: true,
    },
  ],
  createRenderer: createJuliaRenderer,
  explainer: () => import('./Explainer'),
}
