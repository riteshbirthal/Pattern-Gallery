import type { Pattern } from '../../types/pattern'
import { createLeniaRenderer } from './renderer'

export const lenia: Pattern = {
  id: 'lenia',
  title: 'Lenia',
  category: 'Cellular Automata',
  blurb:
    "Bert Chan's continuous Game of Life. State and time are real-valued; the update is a convolution with a smooth ring kernel. Living, breathing creatures emerge.",
  params: [
    {
      type: 'number',
      name: 'mu',
      label: 'growth center (μ)',
      description: 'Where the bell-curve growth function peaks.',
      min: 0.05,
      max: 0.5,
      step: 0.001,
      default: 0.15,
    },
    {
      type: 'number',
      name: 'sigma',
      label: 'growth width (σ)',
      min: 0.005,
      max: 0.05,
      step: 0.001,
      default: 0.017,
    },
    {
      type: 'number',
      name: 'dt',
      label: 'time step',
      description: 'Smaller = smoother, slower; larger = jittery, faster.',
      min: 0.05,
      max: 0.5,
      step: 0.01,
      default: 0.1,
    },
  ],
  createRenderer: createLeniaRenderer,
  explainer: () => import('./Explainer'),
}
