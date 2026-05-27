import type { Pattern } from '../../types/pattern'
import { createBarnsleyFernRenderer } from './renderer'

export const barnsleyFern: Pattern = {
  id: 'barnsley-fern',
  title: 'Barnsley Fern',
  category: 'Fractals',
  blurb:
    'A botanically convincing fern, drawn one pixel at a time by an iterated function system of just four affine transformations.',
  params: [
    {
      type: 'select',
      name: 'preset',
      label: 'species',
      options: [
        { value: 'fern', label: 'Black spleenwort' },
        { value: 'cyclosorus', label: 'Cyclosorus' },
        { value: 'fishbone', label: 'Fishbone' },
      ],
      default: 'fern',
    },
    {
      type: 'number',
      name: 'pointsPerStep',
      label: 'points per frame',
      description: 'Higher = faster fill, more CPU.',
      min: 500,
      max: 8000,
      step: 100,
      default: 3000,
    },
  ],
  createRenderer: createBarnsleyFernRenderer,
  explainer: () => import('./Explainer'),
}
