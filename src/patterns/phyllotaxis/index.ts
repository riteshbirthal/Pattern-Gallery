import type { Pattern } from '../../types/pattern'
import { createPhyllotaxisRenderer } from './renderer'

export const phyllotaxis: Pattern = {
  id: 'phyllotaxis',
  title: 'Phyllotaxis',
  category: 'Growth',
  blurb:
    'How sunflowers pack their seeds. The golden angle (~137.5°) is the unique value that gives the densest, most uniform spiral packing.',
  params: [
    {
      type: 'number',
      name: 'angle',
      label: 'angle (°)',
      description: '137.508° is the golden angle — try moving by 0.1° to break the symmetry.',
      min: 130,
      max: 145,
      step: 0.01,
      default: 137.508,
    },
    {
      type: 'number',
      name: 'spacing',
      label: 'spacing',
      description: 'Distance constant c in r = c√n.',
      min: 1,
      max: 10,
      step: 0.1,
      default: 4,
    },
    {
      type: 'number',
      name: 'dotSize',
      label: 'dot size',
      min: 1,
      max: 8,
      step: 0.5,
      default: 3,
    },
    {
      type: 'number',
      name: 'count',
      label: 'total dots',
      min: 200,
      max: 4000,
      step: 100,
      default: 1500,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'sunset', label: 'Sunset' },
        { value: 'forest', label: 'Forest' },
        { value: 'rainbow', label: 'Rainbow' },
      ],
      default: 'sunset',
    },
  ],
  createRenderer: createPhyllotaxisRenderer,
  explainer: () => import('./Explainer'),
}
