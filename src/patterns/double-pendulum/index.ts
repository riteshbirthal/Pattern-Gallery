import type { Pattern } from '../../types/pattern'
import { createDoublePendulumRenderer } from './renderer'

export const doublePendulum: Pattern = {
  id: 'double-pendulum',
  title: 'Double Pendulum',
  category: 'Physics',
  blurb:
    'Two pendulums hinged together — the textbook example of mechanical chaos. Released with nearly identical initial angles, copies diverge exponentially, painting their second-bob traces into beautiful rosettes.',
  params: [
    { type: 'number', name: 'theta1', label: 'θ₁ (deg)', min: 0, max: 180, step: 1, default: 120 },
    { type: 'number', name: 'theta2', label: 'θ₂ (deg)', min: 0, max: 180, step: 1, default: 120 },
    { type: 'number', name: 'copies', label: 'copies', min: 1, max: 30, step: 1, default: 12 },
    { type: 'number', name: 'spread', label: 'spread', min: 0, max: 5, step: 0.1, default: 1 },
  ],
  createRenderer: createDoublePendulumRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
