import type { Pattern } from '../../types/pattern'
import { createFlowFieldRenderer } from './renderer'

export const flowField: Pattern = {
  id: 'flow-field',
  title: 'Flow Field',
  category: 'Noise / Flow',
  blurb:
    'Particles wander through a vector field defined by 3D simplex noise, painting trails as they go.',
  params: [
    {
      type: 'number',
      name: 'noiseScale',
      label: 'noise scale',
      description: 'Smaller = smoother flow; larger = more turbulent.',
      min: 1,
      max: 10,
      step: 0.5,
      default: 3,
    },
    {
      type: 'number',
      name: 'speed',
      label: 'particle speed',
      description: 'Pixels per step.',
      min: 0.5,
      max: 4,
      step: 0.1,
      default: 1.5,
    },
    {
      type: 'number',
      name: 'particles',
      label: 'particle count',
      description: 'How many walkers paint the field.',
      min: 200,
      max: 4000,
      step: 100,
      default: 1500,
    },
    {
      type: 'number',
      name: 'fade',
      label: 'trail fade',
      description: '0 = persistent trails; higher fades them out.',
      min: 0,
      max: 0.05,
      step: 0.001,
      default: 0.005,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'aurora', label: 'Aurora' },
        { value: 'sunset', label: 'Sunset' },
        { value: 'mono', label: 'Mono' },
      ],
      default: 'aurora',
    },
  ],
  createRenderer: createFlowFieldRenderer,
  explainer: () => import('./Explainer'),
}
