import type { Pattern } from '../../types/pattern'
import { createLevyCRenderer } from './renderer'

export const levyC: Pattern = {
  id: 'levy-c',
  title: 'Lévy C Curve',
  category: 'Fractals',
  blurb:
    "Paul Lévy 1938. Replace each line segment with two segments forming a 90° tent over it. Iterate. The limit curve is self-similar at half-scale and densely fills a fattened C-shape.",
  params: [
    {
      type: 'number',
      name: 'order',
      label: 'recursion depth',
      min: 1,
      max: 16,
      step: 1,
      default: 12,
    },
    {
      type: 'number',
      name: 'angle',
      label: 'apex angle (deg)',
      description: '90° = classic Lévy C. Smaller = thinner. Larger = wider sweep.',
      min: 30,
      max: 150,
      step: 1,
      default: 90,
    },
    {
      type: 'boolean',
      name: 'colorByT',
      label: 'rainbow by curve parameter',
      default: true,
    },
  ],
  createRenderer: createLevyCRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
