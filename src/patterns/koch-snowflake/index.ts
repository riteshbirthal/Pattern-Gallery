import type { Pattern } from '../../types/pattern'
import { createKochRenderer } from './renderer'

export const kochSnowflake: Pattern = {
  id: 'koch-snowflake',
  title: 'Koch Snowflake',
  category: 'Fractals',
  blurb:
    "Helge von Koch 1904. Replace each line segment by 4 segments forming an outward bump. Iterate. Finite area, infinite perimeter — the founding example of a continuous nowhere-differentiable curve.",
  params: [
    {
      type: 'select',
      name: 'variant',
      label: 'shape',
      options: [
        { value: 'snowflake', label: 'Koch snowflake (outward)' },
        { value: 'antisnowflake', label: 'Anti-snowflake (inward)' },
        { value: 'curve', label: 'Koch curve (single edge)' },
      ],
      default: 'snowflake',
    },
    {
      type: 'number',
      name: 'order',
      label: 'iteration depth',
      min: 0,
      max: 7,
      step: 1,
      default: 5,
    },
  ],
  createRenderer: createKochRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
