import type { Pattern } from '../../types/pattern'
import { createApollonianRenderer } from './renderer'

export const apollonian: Pattern = {
  id: 'apollonian',
  title: 'Apollonian Gasket',
  category: 'Fractals',
  blurb:
    'Three mutually tangent circles inside a fourth. Fill every curvilinear triangle with the unique inscribed circle. Repeat. Forever. Descartes\' circle theorem makes the recursion exact.',
  params: [
    {
      type: 'number',
      name: 'k1',
      label: 'k₁ (curvature)',
      min: 1,
      max: 6,
      step: 0.1,
      default: 2,
    },
    {
      type: 'number',
      name: 'k2',
      label: 'k₂',
      min: 1,
      max: 6,
      step: 0.1,
      default: 2,
    },
    {
      type: 'number',
      name: 'k3',
      label: 'k₃',
      min: 1,
      max: 6,
      step: 0.1,
      default: 3,
    },
    {
      type: 'number',
      name: 'depth',
      label: 'recursion depth',
      min: 1,
      max: 10,
      step: 1,
      default: 6,
    },
    { type: 'boolean', name: 'fill', label: 'fill circles', default: true },
    { type: 'boolean', name: 'stroke', label: 'stroke circles', default: true },
  ],
  createRenderer: createApollonianRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
