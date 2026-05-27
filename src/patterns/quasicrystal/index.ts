import type { Pattern } from '../../types/pattern'
import { createQuasicrystalRenderer } from './renderer'

export const quasicrystal: Pattern = {
  id: 'quasicrystal',
  title: 'Quasicrystal Interference',
  category: 'Procedural',
  blurb:
    "Dan Shechtman's Nobel-winning 1982 discovery of icosahedral symmetry in real solids inspired this stripe-superposition picture: sum N plane waves rotated equally around a point and the interference produces aperiodic 'forbidden' rotational symmetries.",
  params: [
    { type: 'number', name: 'waves', label: 'waves N', min: 3, max: 13, step: 1, default: 7 },
    { type: 'number', name: 'frequency', label: 'frequency', min: 1, max: 20, step: 0.5, default: 6 },
    { type: 'number', name: 'phase', label: 'phase', min: 0, max: 6.28, step: 0.05, default: 0 },
  ],
  createRenderer: createQuasicrystalRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
