import type { Pattern } from '../../types/pattern'
import { createHilbertRenderer } from './renderer'

export const hilbert: Pattern = {
  id: 'hilbert',
  title: 'Space-Filling Curves',
  category: 'Geometry',
  blurb:
    "Hilbert (1891), Peano (1890), and Moore curves: continuous 1D paths that visit every point of a 2D square in the limit. The 19th-century existence proof that 'dimension' is more subtle than it looks.",
  params: [
    {
      type: 'select',
      name: 'curve',
      label: 'curve',
      options: [
        { value: 'hilbert', label: "Hilbert (1891) — base 2" },
        { value: 'peano', label: 'Peano (1890) — base 3' },
        { value: 'moore', label: 'Moore — closed Hilbert' },
      ],
      default: 'hilbert',
    },
    {
      type: 'number',
      name: 'order',
      label: 'order (recursion depth)',
      min: 1,
      max: 7,
      step: 1,
      default: 5,
    },
    {
      type: 'number',
      name: 'animSpeed',
      label: 'animation speed',
      description: 'Segments drawn per frame.',
      min: 1,
      max: 200,
      step: 1,
      default: 30,
    },
    {
      type: 'boolean',
      name: 'colorByT',
      label: 'rainbow by curve parameter',
      default: true,
    },
  ],
  createRenderer: createHilbertRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
