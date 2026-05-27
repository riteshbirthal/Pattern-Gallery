import type { Pattern } from '../../types/pattern'
import { createForestFireRenderer } from './renderer'

export const forestFire: Pattern = {
  id: 'forest-fire',
  title: 'Forest Fire',
  category: 'Cellular Automata',
  blurb:
    'Bak-Chen-Tang 1990. Trees grow, lightning ignites, fire spreads to neighbors. The size distribution of fires follows a power law — a textbook self-organized critical system.',
  params: [
    {
      type: 'number',
      name: 'growth',
      label: 'tree growth probability (p)',
      min: 0.0,
      max: 0.05,
      step: 0.001,
      default: 0.01,
    },
    {
      type: 'number',
      name: 'lightning',
      label: 'lightning probability (f)',
      min: 0.0,
      max: 0.001,
      step: 0.00001,
      default: 0.00006,
    },
    {
      type: 'number',
      name: 'initialDensity',
      label: 'initial tree density',
      min: 0.0,
      max: 1.0,
      step: 0.01,
      default: 0.55,
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size',
      min: 2,
      max: 6,
      step: 1,
      default: 3,
    },
  ],
  createRenderer: createForestFireRenderer,
  explainer: () => import('./Explainer'),
}
