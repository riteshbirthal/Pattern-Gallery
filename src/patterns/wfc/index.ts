import type { Pattern } from '../../types/pattern'
import { createWFCRenderer } from './renderer'

export const wfc: Pattern = {
  id: 'wfc',
  title: 'Wave Function Collapse',
  category: 'Procedural',
  blurb:
    'Maxim Gumin (2016) adapted constraint propagation from quantum-mechanical analogy: collapse the lowest-entropy cell, propagate, repeat. Generates locally consistent patchworks beloved by indie game developers.',
  params: [
    { type: 'number', name: 'cellSize', label: 'cell size', min: 8, max: 32, step: 2, default: 16 },
  ],
  createRenderer: createWFCRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
