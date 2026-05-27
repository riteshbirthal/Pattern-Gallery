import type { Pattern } from '../../types/pattern'
import { createWorleyRenderer } from './renderer'

export const worley: Pattern = {
  id: 'worley',
  title: 'Worley / Voronoi Noise',
  category: 'Procedural',
  blurb:
    'Steven Worley (1996) defined cellular noise as the distance to the n-th nearest of a set of random feature points. Used everywhere in CGI for water caustics, alien skin, and stone textures.',
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'channel',
      default: 'cells',
      options: [
        { value: 'cells', label: 'Voronoi cells with edges' },
        { value: 'voronoi', label: 'flat Voronoi regions' },
        { value: 'f1', label: 'F1 (distance to nearest)' },
        { value: 'f2-f1', label: 'F2 − F1 (cell ridges)' },
      ],
    },
    { type: 'number', name: 'sites', label: 'feature points', min: 10, max: 300, step: 10, default: 60 },
    { type: 'number', name: 'seed', label: 'seed', min: 1, max: 100, step: 1, default: 1 },
  ],
  createRenderer: createWorleyRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
