import type { Pattern } from '../../types/pattern'
import { createLogisticRenderer } from './renderer'

export const logistic: Pattern = {
  id: 'logistic',
  title: 'Logistic Bifurcation',
  category: 'Chaos',
  blurb:
    'Iterate x → rx(1-x) for many starting r values; plot the long-term values vertically. The result is the canonical road from order to chaos via period-doubling.',
  params: [
    {
      type: 'number',
      name: 'rMin',
      label: 'r min',
      min: 0,
      max: 4,
      step: 0.001,
      default: 2.5,
    },
    {
      type: 'number',
      name: 'rMax',
      label: 'r max',
      min: 0,
      max: 4,
      step: 0.001,
      default: 4.0,
    },
    {
      type: 'number',
      name: 'transient',
      label: 'transient iterations',
      description: 'Iterations to discard before plotting (lets the orbit settle).',
      min: 100,
      max: 2000,
      step: 100,
      default: 500,
    },
    {
      type: 'number',
      name: 'samples',
      label: 'samples per r',
      min: 50,
      max: 1000,
      step: 50,
      default: 300,
    },
  ],
  createRenderer: createLogisticRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
