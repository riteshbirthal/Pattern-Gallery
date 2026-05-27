import type { Pattern } from '../../types/pattern'
import { createLissajousRenderer } from './renderer'

export const lissajous: Pattern = {
  id: 'lissajous',
  title: 'Lissajous Curves',
  category: 'Geometry',
  blurb:
    'Two perpendicular sinusoids of different frequencies. The trace closes into knots if the frequency ratio is rational; if irrational, it densely fills a rectangle forever.',
  params: [
    {
      type: 'number',
      name: 'a',
      label: 'frequency a',
      min: 1,
      max: 20,
      step: 1,
      default: 3,
    },
    {
      type: 'number',
      name: 'b',
      label: 'frequency b',
      min: 1,
      max: 20,
      step: 1,
      default: 4,
    },
    {
      type: 'number',
      name: 'delta',
      label: 'phase δ (deg)',
      min: 0,
      max: 360,
      step: 1,
      default: 90,
    },
    {
      type: 'number',
      name: 'samples',
      label: 'samples',
      min: 200,
      max: 5000,
      step: 100,
      default: 2000,
    },
    { type: 'boolean', name: 'animate', label: 'animate phase', default: true },
    {
      type: 'number',
      name: 'driftSpeed',
      label: 'drift speed',
      min: 0,
      max: 5,
      step: 0.1,
      default: 1,
    },
  ],
  createRenderer: createLissajousRenderer,
  explainer: () => import('./Explainer'),
}
