import type { Pattern } from '../../types/pattern'
import { createChladniRenderer } from './renderer'

export const chladni: Pattern = {
  id: 'chladni',
  title: 'Chladni Plate',
  category: 'Geometry',
  blurb:
    "Sand on a vibrating plate flees the antinodes and gathers on the nodal lines, tracing the geometry of standing-wave modes. Demonstrated by Ernst Chladni in 1787.",
  params: [
    {
      type: 'number',
      name: 'm',
      label: 'mode m',
      min: 1,
      max: 10,
      step: 1,
      default: 3,
    },
    {
      type: 'number',
      name: 'n',
      label: 'mode n',
      min: 1,
      max: 10,
      step: 1,
      default: 5,
    },
    {
      type: 'number',
      name: 'particles',
      label: 'sand grains',
      min: 1000,
      max: 10000,
      step: 500,
      default: 4000,
    },
    {
      type: 'number',
      name: 'speed',
      label: 'jitter scale',
      description: 'How vigorously antinode regions throw the sand around.',
      min: 0,
      max: 10,
      step: 0.1,
      default: 4,
    },
    {
      type: 'number',
      name: 'noise',
      label: 'thermal noise',
      min: 0,
      max: 2,
      step: 0.05,
      default: 0.3,
    },
    { type: 'boolean', name: 'showField', label: 'show wave field', default: true },
  ],
  createRenderer: createChladniRenderer,
  explainer: () => import('./Explainer'),
}
