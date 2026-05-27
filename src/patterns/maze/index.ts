import type { Pattern } from '../../types/pattern'
import { createMazeRenderer } from './renderer'

export const maze: Pattern = {
  id: 'maze',
  title: 'Maze Generation',
  category: 'Growth',
  blurb:
    'Three classic algorithms for spanning trees of a grid graph: recursive backtracker (DFS), Prim\'s, and Wilson\'s loop-erased random walk. Same maze grammar — three radically different growth shapes.',
  params: [
    {
      type: 'select',
      name: 'algorithm',
      label: 'algorithm',
      options: [
        { value: 'backtracker', label: 'Recursive backtracker (DFS)' },
        { value: 'prim', label: "Prim's algorithm" },
        { value: 'wilson', label: "Wilson's (loop-erased random walk)" },
      ],
      default: 'backtracker',
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 4,
      max: 24,
      step: 1,
      default: 10,
    },
  ],
  createRenderer: createMazeRenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 4,
}
