import type { Pattern } from '../../types/pattern'
import { createSternBrocotRenderer } from './renderer'

export const sternBrocot: Pattern = {
  id: 'stern-brocot',
  title: 'Stern-Brocot / Farey',
  category: 'Number Theory',
  blurb:
    'Moritz Stern (1858) and Achille Brocot (1861) independently constructed a binary tree containing every positive rational exactly once, in lowest terms. The Farey view (Ford circles) tessellates the unit interval beautifully.',
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'view',
      default: 'tree',
      options: [
        { value: 'tree', label: 'Stern-Brocot tree' },
        { value: 'ford', label: 'Ford circles (Farey)' },
      ],
    },
    { type: 'number', name: 'depth', label: 'depth / order', min: 3, max: 12, step: 1, default: 7 },
  ],
  createRenderer: createSternBrocotRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
