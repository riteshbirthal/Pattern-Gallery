import type { Pattern } from '../../types/pattern'
import { createPythagorasTreeRenderer } from './renderer'

export const pythagorasTree: Pattern = {
  id: 'pythagoras-tree',
  title: 'Pythagoras Tree',
  category: 'Fractals',
  blurb:
    "Albert Bosman 1942. Each square sprouts a right-triangle hat, and on the two new sides another square. The asymmetry of the right triangle's angle determines the shape: 45° = symmetric tree, less = leaning, more = curling.",
  params: [
    {
      type: 'number',
      name: 'angle',
      label: 'triangle angle (deg)',
      description: '45° = symmetric. Smaller leans right, larger leans left.',
      min: 10,
      max: 80,
      step: 1,
      default: 45,
    },
    {
      type: 'number',
      name: 'depth',
      label: 'recursion depth',
      min: 1,
      max: 12,
      step: 1,
      default: 9,
    },
    {
      type: 'number',
      name: 'baseSize',
      label: 'trunk size',
      min: 0.4,
      max: 1.5,
      step: 0.05,
      default: 1,
    },
  ],
  createRenderer: createPythagorasTreeRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
