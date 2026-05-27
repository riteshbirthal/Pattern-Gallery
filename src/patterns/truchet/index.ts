import type { Pattern } from '../../types/pattern'
import { createTruchetRenderer } from './renderer'

export const truchet: Pattern = {
  id: 'truchet',
  title: 'Truchet Tiles',
  category: 'Geometry',
  blurb:
    'A grid of identical tiles, each rotated randomly. Sébastien Truchet (1704) noticed that this minimal recipe produces astonishingly rich global patterns — labyrinths from local randomness.',
  params: [
    {
      type: 'select',
      name: 'style',
      label: 'tile style',
      options: [
        { value: 'arcs', label: 'Quarter-circle arcs' },
        { value: 'lines', label: 'Straight lines' },
        { value: 'triangles', label: 'Filled triangles' },
      ],
      default: 'arcs',
    },
    {
      type: 'number',
      name: 'tileSize',
      label: 'tile size (px)',
      min: 16,
      max: 80,
      step: 4,
      default: 36,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'cyan', label: 'Cyan' },
        { value: 'blueprint', label: 'Blueprint' },
        { value: 'rose', label: 'Rose' },
        { value: 'mono', label: 'Mono' },
      ],
      default: 'cyan',
    },
  ],
  createRenderer: createTruchetRenderer,
  explainer: () => import('./Explainer'),
}
