import type { Pattern } from '../../types/pattern'
import { createFitzHughNagumoRenderer } from './renderer'

export const fitzhughNagumo: Pattern = {
  id: 'fitzhugh-nagumo',
  title: 'FitzHugh-Nagumo',
  category: 'Reaction-Diffusion',
  blurb:
    "Richard FitzHugh (1961) and Jin-Ichi Nagumo's (1962) excitable-medium model — a simplification of Hodgkin-Huxley that captures cardiac action potentials and produces spiral waves identical to those seen in fibrillating heart tissue.",
  params: [
    {
      type: 'select',
      name: 'preset',
      label: 'initial state',
      default: 'spiral',
      options: [
        { value: 'spiral', label: 'spiral seed' },
        { value: 'pulse', label: 'wave pulse' },
        { value: 'random', label: 'random noise' },
      ],
    },
    { type: 'number', name: 'a', label: 'a', min: 0, max: 0.4, step: 0.01, default: 0.1 },
    { type: 'number', name: 'b', label: 'b', min: 0, max: 1, step: 0.01, default: 0.5 },
    { type: 'number', name: 'epsilon', label: 'ε', min: 0.005, max: 0.1, step: 0.001, default: 0.02 },
    { type: 'number', name: 'gridSize', label: 'cell size', min: 2, max: 6, step: 1, default: 3 },
  ],
  createRenderer: createFitzHughNagumoRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
