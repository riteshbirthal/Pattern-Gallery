import type { Pattern } from '../../types/pattern'
import { createGrayScottRenderer } from './renderer'

export const grayScott: Pattern = {
  id: 'gray-scott',
  title: 'Gray-Scott Reaction-Diffusion',
  category: 'Reaction-Diffusion',
  blurb:
    'Two virtual chemicals (U and V) react and diffuse on a 2D surface. Tiny changes in feed/kill rates yield spots, stripes, mitosis, or coral.',
  params: [
    {
      type: 'number',
      name: 'feed',
      label: 'feed (F)',
      description: 'Replenishment rate of U.',
      min: 0.01,
      max: 0.08,
      step: 0.001,
      default: 0.037,
    },
    {
      type: 'number',
      name: 'kill',
      label: 'kill (k)',
      description: 'Removal rate of V.',
      min: 0.04,
      max: 0.07,
      step: 0.001,
      default: 0.06,
    },
    {
      type: 'number',
      name: 'du',
      label: 'Du',
      description: 'Diffusion rate of U.',
      min: 0.1,
      max: 0.4,
      step: 0.01,
      default: 0.2097,
    },
    {
      type: 'number',
      name: 'dv',
      label: 'Dv',
      description: 'Diffusion rate of V (lower = sharper structures).',
      min: 0.05,
      max: 0.2,
      step: 0.005,
      default: 0.105,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'cool', label: 'Cool' },
        { value: 'fire', label: 'Fire' },
        { value: 'mono', label: 'Mono' },
      ],
      default: 'cool',
    },
  ],
  createRenderer: createGrayScottRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
  stepsPerFrame: 8,
}
