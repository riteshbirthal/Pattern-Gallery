import type { Pattern } from '../../types/pattern'
import { createBuddhabrotRenderer } from './renderer'

export const buddhabrot: Pattern = {
  id: 'buddhabrot',
  title: 'Buddhabrot',
  category: 'Fractals',
  blurb:
    'Same iteration as the Mandelbrot, but instead of coloring c by escape time, draw the orbit trajectories of escaping c values. The accumulation forms an eerie meditating figure.',
  params: [
    {
      type: 'number',
      name: 'maxIter',
      label: 'max iterations',
      description: 'Higher = thinner, more defined arms. Costs CPU.',
      min: 100,
      max: 4000,
      step: 100,
      default: 1000,
    },
    {
      type: 'number',
      name: 'samplesPerStep',
      label: 'samples per frame',
      min: 200,
      max: 8000,
      step: 100,
      default: 2000,
    },
    {
      type: 'select',
      name: 'tint',
      label: 'palette',
      options: [
        { value: 'mono', label: 'Mono' },
        { value: 'gold', label: 'Gold' },
        { value: 'cool', label: 'Cool blue' },
        { value: 'rose', label: 'Rose' },
      ],
      default: 'gold',
    },
  ],
  createRenderer: createBuddhabrotRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 30,
}
