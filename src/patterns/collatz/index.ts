import type { Pattern } from '../../types/pattern'
import { createCollatzRenderer } from './renderer'

export const collatz: Pattern = {
  id: 'collatz',
  title: 'Collatz Orbits',
  category: 'Number Theory',
  blurb:
    'Lothar Collatz (1937) conjectured that iterating "halve if even, 3n+1 if odd" always reaches 1. The conjecture remains open after 90 years; Erdős said "mathematics is not yet ready for such problems."',
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'view',
      default: 'lines',
      options: [
        { value: 'lines', label: 'orbit traces' },
        { value: 'scatter', label: 'stopping times' },
        { value: 'tree', label: 'recoil tree' },
      ],
    },
    { type: 'number', name: 'seeds', label: 'seeds', min: 50, max: 4000, step: 50, default: 1000 },
  ],
  createRenderer: createCollatzRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
