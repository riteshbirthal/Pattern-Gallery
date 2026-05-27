import type { Pattern } from '../../types/pattern'
import { createLorenzRenderer } from './renderer'

export const lorenz: Pattern = {
  id: 'lorenz',
  title: 'Lorenz Attractor',
  category: 'Chaos',
  blurb:
    "The original strange attractor — Edward Lorenz's 1963 weather model. Tiny changes in initial conditions diverge exponentially yet trace out a butterfly-shaped manifold.",
  params: [
    {
      type: 'number',
      name: 'sigma',
      label: 'σ',
      min: 5,
      max: 20,
      step: 0.1,
      default: 10,
    },
    {
      type: 'number',
      name: 'rho',
      label: 'ρ',
      min: 14,
      max: 50,
      step: 0.1,
      default: 28,
    },
    {
      type: 'number',
      name: 'beta',
      label: 'β',
      min: 1,
      max: 5,
      step: 0.05,
      default: 2.667,
    },
    {
      type: 'number',
      name: 'particles',
      label: 'particles',
      min: 10,
      max: 200,
      step: 5,
      default: 60,
    },
    {
      type: 'number',
      name: 'fade',
      label: 'trail fade',
      min: 0,
      max: 0.05,
      step: 0.001,
      default: 0.012,
    },
  ],
  createRenderer: createLorenzRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 4,
}
