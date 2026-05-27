import type { Pattern } from '../../types/pattern'
import { createPenroseRenderer } from './renderer'

export const penrose: Pattern = {
  id: 'penrose',
  title: 'Penrose Tiling',
  category: 'Geometry',
  blurb:
    'An aperiodic tiling of the plane with 5-fold symmetry. Two tile shapes (thick + thin) cover the plane forever — but never repeat exactly. Built by recursive deflation.',
  params: [
    {
      type: 'number',
      name: 'depth',
      label: 'subdivision depth',
      description: 'Each level multiplies tile count by ~φ². Above 7 may be slow.',
      min: 1,
      max: 8,
      step: 1,
      default: 5,
    },
    { type: 'boolean', name: 'showThick', label: 'show thick tiles', default: true },
    { type: 'boolean', name: 'showThin', label: 'show thin tiles', default: true },
    { type: 'boolean', name: 'stroke', label: 'tile borders', default: true },
  ],
  createRenderer: createPenroseRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
