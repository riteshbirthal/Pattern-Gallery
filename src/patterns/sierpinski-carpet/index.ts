import type { Pattern } from '../../types/pattern'
import { createSierpinskiCarpetRenderer } from './renderer'

export const sierpinskiCarpet: Pattern = {
  id: 'sierpinski-carpet',
  title: 'Sierpinski Carpet & Friends',
  category: 'Fractals',
  blurb:
    "Sierpinski's 1916 carpet, the T-square, and the Vicsek (plus-sign) fractal — all built by deleting a different sub-square of the 3×3 grid. Three completely different fractal dimensions from one piece of code.",
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'fractal',
      options: [
        { value: 'carpet', label: 'Sierpinski Carpet (delete center)' },
        { value: 'tsquare', label: 'T-square' },
        { value: 'vicsek', label: 'Vicsek (delete corners)' },
      ],
      default: 'carpet',
    },
    {
      type: 'number',
      name: 'order',
      label: 'recursion depth',
      min: 1,
      max: 6,
      step: 1,
      default: 5,
    },
  ],
  createRenderer: createSierpinskiCarpetRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
