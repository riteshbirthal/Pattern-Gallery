import type { Pattern } from '../../types/pattern'
import { createVoronoiRenderer } from './renderer'

export const voronoi: Pattern = {
  id: 'voronoi',
  title: 'Voronoi Diagram',
  category: 'Geometry',
  blurb:
    'Partition the plane: each pixel belongs to whichever site is nearest. Models giraffe coats, dragonfly wings, soap foam, and cracked mud.',
  params: [
    {
      type: 'number',
      name: 'sites',
      label: 'sites',
      description: 'Number of generator points.',
      min: 5,
      max: 80,
      step: 1,
      default: 24,
    },
    {
      type: 'select',
      name: 'metric',
      label: 'distance metric',
      options: [
        { value: 'euclidean', label: 'Euclidean (L²)' },
        { value: 'manhattan', label: 'Manhattan (L¹)' },
        { value: 'chebyshev', label: 'Chebyshev (L∞)' },
      ],
      default: 'euclidean',
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'vibrant', label: 'Vibrant' },
        { value: 'pastel', label: 'Pastel' },
        { value: 'mono', label: 'Mono' },
      ],
      default: 'vibrant',
    },
    {
      type: 'boolean',
      name: 'edges',
      label: 'highlight edges',
      default: true,
    },
    {
      type: 'boolean',
      name: 'move',
      label: 'animate sites',
      default: true,
    },
  ],
  createRenderer: createVoronoiRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 2,
}
