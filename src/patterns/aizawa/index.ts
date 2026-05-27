import type { Pattern } from '../../types/pattern'
import { createAizawaRenderer } from './renderer'

export const aizawa: Pattern = {
  id: 'aizawa',
  title: 'Aizawa Attractor',
  category: 'Chaos',
  blurb:
    "Yoji Aizawa's vortex-and-tube attractor: the trajectory winds around a central tube while precessing through a vortex above it. Hard to make pretty without the right view; easy to over-fit.",
  params: [
    { type: 'number', name: 'a', label: 'a', min: 0.5, max: 1.2, step: 0.01, default: 0.95 },
    { type: 'number', name: 'b', label: 'b', min: 0.5, max: 0.9, step: 0.01, default: 0.7 },
    { type: 'number', name: 'c', label: 'c', min: 0.5, max: 0.7, step: 0.01, default: 0.6 },
    { type: 'number', name: 'd', label: 'd', min: 3.0, max: 4.0, step: 0.1, default: 3.5 },
    { type: 'number', name: 'e', label: 'e', min: 0.1, max: 0.5, step: 0.01, default: 0.25 },
    { type: 'number', name: 'f', label: 'f', min: 0.05, max: 0.2, step: 0.01, default: 0.1 },
    {
      type: 'number',
      name: 'particles',
      label: 'particles',
      min: 1,
      max: 24,
      step: 1,
      default: 8,
    },
    {
      type: 'number',
      name: 'fade',
      label: 'trail fade',
      min: 0,
      max: 0.05,
      step: 0.001,
      default: 0.006,
    },
  ],
  createRenderer: createAizawaRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 8,
}
