import type { Pattern } from '../../types/pattern'
import { createMandelbrotRenderer } from './renderer'

export const mandelbrot: Pattern = {
  id: 'mandelbrot',
  title: 'Mandelbrot Set',
  category: 'Fractals',
  blurb:
    'The most famous escape-time fractal. Iterate z ↦ z² + c and ask: does z stay bounded? The answer at every point in the complex plane traces an infinitely intricate boundary.',
  params: [
    {
      type: 'number',
      name: 'cx',
      label: 'center x',
      min: -2,
      max: 1,
      step: 0.001,
      default: -0.5,
    },
    {
      type: 'number',
      name: 'cy',
      label: 'center y',
      min: -1.5,
      max: 1.5,
      step: 0.001,
      default: 0,
    },
    {
      type: 'number',
      name: 'zoom',
      label: 'zoom',
      min: 0.3,
      max: 100,
      step: 0.1,
      default: 0.7,
    },
    {
      type: 'number',
      name: 'iterations',
      label: 'max iterations',
      description: 'Higher = more detail near the boundary, slower.',
      min: 50,
      max: 1000,
      step: 10,
      default: 200,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'fire', label: 'Fire' },
        { value: 'ocean', label: 'Ocean' },
        { value: 'rainbow', label: 'Rainbow' },
      ],
      default: 'fire',
    },
    {
      type: 'boolean',
      name: 'animate',
      label: 'breathing zoom',
      description: 'Slowly pulse the zoom.',
      default: false,
    },
  ],
  createRenderer: createMandelbrotRenderer,
  explainer: () => import('./Explainer'),
}
