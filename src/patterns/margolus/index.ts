import type { Pattern } from '../../types/pattern'
import { createMargolusRenderer } from './renderer'

export const margolus: Pattern = {
  id: 'margolus',
  title: 'Margolus Block CA',
  category: 'Cellular Automata',
  blurb:
    "Norman Margolus 1984. Partition the grid into 2×2 blocks; rotate the partition each step. Block-local rules are *reversible* by construction — they can simulate physics. Includes the famous Critters and BBM (Billiard Ball Machine) rules.",
  params: [
    {
      type: 'select',
      name: 'rule',
      label: 'rule',
      options: [
        { value: 'critters', label: 'Critters (reversible)' },
        { value: 'bbm', label: 'BBM (Billiard Ball)' },
        { value: 'tmgas', label: 'TM Gas (lattice gas)' },
        { value: 'tron', label: 'Tron' },
      ],
      default: 'critters',
    },
    {
      type: 'number',
      name: 'density',
      label: 'initial density',
      min: 0.05,
      max: 0.6,
      step: 0.01,
      default: 0.25,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 2,
      max: 10,
      step: 1,
      default: 3,
    },
  ],
  createRenderer: createMargolusRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 4,
}
