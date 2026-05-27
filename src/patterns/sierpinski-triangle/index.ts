import type { Pattern } from '../../types/pattern'
import { createSierpinskiTriangleRenderer } from './renderer'

export const sierpinskiTriangle: Pattern = {
  id: 'sierpinski-triangle',
  title: 'Sierpinski Triangle',
  category: 'Fractals',
  blurb:
    "Sierpiński 1915. Recursively replace each triangle with three half-size copies in its corners. Equivalent to Pascal's triangle mod 2 — the same shape appears in number theory, IFS, the chaos game, and Wolfram's Rule 90.",
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'construction',
      options: [
        { value: 'sierpinski', label: 'Geometric recursion' },
        { value: 'pascal', label: "Pascal's triangle mod 2" },
      ],
      default: 'sierpinski',
    },
    {
      type: 'number',
      name: 'order',
      label: 'recursion depth',
      min: 1,
      max: 9,
      step: 1,
      default: 7,
    },
  ],
  createRenderer: createSierpinskiTriangleRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
