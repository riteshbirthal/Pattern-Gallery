import type { Pattern } from '../../types/pattern'
import { createThomasRenderer } from './renderer'

export const thomasAttractor: Pattern = {
  id: 'thomas-attractor',
  title: 'Thomas Attractor',
  category: 'Chaos',
  blurb:
    "René Thomas 1999. ẋ = sin(y) - bx (cyclic). Among the cleanest minimal chaotic flows: 3 sine functions and a damping term produce labyrinthine fractal trajectories.",
  params: [
    {
      type: 'number',
      name: 'b',
      label: 'b (damping)',
      description:
        'Below b ≈ 0.208265 the system is chaotic. Above, trajectories spiral to fixed points.',
      min: 0.05,
      max: 0.32,
      step: 0.005,
      default: 0.19,
    },
    {
      type: 'number',
      name: 'particles',
      label: 'particles',
      min: 1,
      max: 24,
      step: 1,
      default: 10,
    },
    {
      type: 'number',
      name: 'fade',
      label: 'trail fade',
      min: 0,
      max: 0.05,
      step: 0.001,
      default: 0.005,
    },
  ],
  createRenderer: createThomasRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 8,
}
