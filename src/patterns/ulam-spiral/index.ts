import type { Pattern } from '../../types/pattern'
import { createUlamSpiralRenderer } from './renderer'

export const ulamSpiral: Pattern = {
  id: 'ulam-spiral',
  title: 'Ulam Spiral',
  category: 'Number Theory',
  blurb:
    'Stanisław Ulam (1963) doodled integers in a square spiral and noticed primes lining up along diagonals. The pattern hints at the still-unproven conjecture that there are infinitely many primes of the form n²+1.',
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'highlight',
      default: 'primes',
      options: [
        { value: 'primes', label: 'all primes' },
        { value: 'twins', label: 'twin primes' },
        { value: 'sophie', label: 'Sophie Germain' },
        { value: 'mod6', label: 'mod 6 coloring' },
      ],
    },
    { type: 'number', name: 'cellSize', label: 'cell size', min: 2, max: 12, step: 1, default: 4 },
  ],
  createRenderer: createUlamSpiralRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
