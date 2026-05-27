import type { Pattern } from '../../types/pattern'
import { createGumowskiMiraRenderer } from './renderer'

export const gumowskiMira: Pattern = {
  id: 'gumowski-mira',
  title: 'Gumowski-Mira Map',
  category: 'Chaos',
  blurb:
    "I. Gumowski & C. Mira (CERN, 1980). A discrete map originally derived from particle accelerator dynamics. The orbit traces ornate biological-looking shapes — beetles, butterflies, mandalas.",
  params: [
    { type: 'number', name: 'a', label: 'a', min: 0, max: 0.05, step: 0.001, default: 0.008 },
    { type: 'number', name: 'b', label: 'b', min: 0.95, max: 1.005, step: 0.001, default: 0.998 },
    { type: 'number', name: 'mu', label: 'μ', min: -1, max: 1, step: 0.01, default: -0.7 },
    {
      type: 'number',
      name: 'zoom',
      label: 'zoom',
      min: 5,
      max: 60,
      step: 1,
      default: 20,
    },
    {
      type: 'number',
      name: 'pointsPerStep',
      label: 'points per frame',
      min: 1000,
      max: 30000,
      step: 500,
      default: 8000,
    },
  ],
  createRenderer: createGumowskiMiraRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
