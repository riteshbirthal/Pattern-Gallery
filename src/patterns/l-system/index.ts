import type { Pattern } from '../../types/pattern'
import { createLSystemRenderer } from './renderer'

export const lSystem: Pattern = {
  id: 'l-system',
  title: 'L-system',
  category: 'Growth',
  blurb:
    'Recursive string rewriting + turtle graphics. A handful of replacement rules grows space-filling curves, dragons, and plant-like branches.',
  params: [
    {
      type: 'select',
      name: 'preset',
      label: 'preset',
      options: [
        { value: 'koch', label: 'Koch curve' },
        { value: 'koch-snowflake', label: 'Koch snowflake' },
        { value: 'dragon', label: 'Dragon curve' },
        { value: 'hilbert', label: 'Hilbert curve' },
        { value: 'sierpinski-arrowhead', label: 'Sierpinski arrowhead' },
        { value: 'plant', label: 'Plant' },
      ],
      default: 'plant',
    },
    {
      type: 'number',
      name: 'iterations',
      label: 'iterations',
      description: 'Recursion depth. String length grows exponentially.',
      min: 1,
      max: 8,
      step: 1,
      default: 5,
    },
    {
      type: 'number',
      name: 'angle',
      label: 'angle (°)',
      description: '0 to use the preset default.',
      min: 0,
      max: 120,
      step: 1,
      default: 0,
    },
    {
      type: 'select',
      name: 'color',
      label: 'color',
      options: [
        { value: 'blue', label: 'Blue' },
        { value: 'plant', label: 'Plant green' },
        { value: 'fire', label: 'Fire' },
        { value: 'mono', label: 'Mono' },
      ],
      default: 'blue',
    },
  ],
  createRenderer: createLSystemRenderer,
  explainer: () => import('./Explainer'),
}
