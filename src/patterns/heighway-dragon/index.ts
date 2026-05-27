import type { Pattern } from '../../types/pattern'
import { createHeighwayDragonRenderer } from './renderer'

export const heighwayDragon: Pattern = {
  id: 'heighway-dragon',
  title: 'Heighway Dragon',
  category: 'Fractals',
  blurb:
    "John Heighway 1966 (NASA). Fold a strip of paper in half n times, unfold each crease to a right angle, follow the path. The result is a self-avoiding curve that tiles the plane and was Jurassic Park's chapter divider.",
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'variant',
      options: [
        { value: 'dragon', label: 'Heighway dragon' },
        { value: 'twin', label: 'Twin dragon' },
        { value: 'terdragon', label: 'Terdragon (60°)' },
      ],
      default: 'dragon',
    },
    {
      type: 'number',
      name: 'order',
      label: 'paper folds (depth)',
      min: 1,
      max: 16,
      step: 1,
      default: 12,
    },
    {
      type: 'boolean',
      name: 'colorByT',
      label: 'rainbow by curve parameter',
      default: true,
    },
  ],
  createRenderer: createHeighwayDragonRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
