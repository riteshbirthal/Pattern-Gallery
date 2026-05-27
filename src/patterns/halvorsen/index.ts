import type { Pattern } from '../../types/pattern'
import { createHalvorsenRenderer } from './renderer'

export const halvorsen: Pattern = {
  id: 'halvorsen',
  title: 'Halvorsen Attractor',
  category: 'Chaos',
  blurb:
    "Arne Dehli Halvorsen's symmetric attractor: ẋ = -ax - 4y - 4z - y². Cyclic symmetry under (x,y,z) → (y,z,x) makes it look like three Lorenz wings braided together.",
  params: [
    { type: 'number', name: 'a', label: 'a', min: 1.1, max: 1.9, step: 0.01, default: 1.4 },
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
      default: 0.008,
    },
  ],
  createRenderer: createHalvorsenRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 8,
}
