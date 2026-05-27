import type { Pattern } from '../../types/pattern'
import { createKuramotoRenderer } from './renderer'

export const kuramoto: Pattern = {
  id: 'kuramoto',
  title: 'Kuramoto Oscillators',
  category: 'Physics',
  blurb:
    'Yoshiki Kuramoto (1975) showed that coupled phase oscillators with random natural frequencies undergo a sharp phase transition to synchronization at a critical coupling strength K_c.',
  params: [
    { type: 'number', name: 'N', label: 'oscillators', min: 20, max: 400, step: 10, default: 150 },
    { type: 'number', name: 'K', label: 'coupling K', min: 0, max: 5, step: 0.05, default: 1.5 },
    { type: 'number', name: 'spread', label: 'frequency spread', min: 0.1, max: 3, step: 0.05, default: 1 },
  ],
  createRenderer: createKuramotoRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 2,
}
