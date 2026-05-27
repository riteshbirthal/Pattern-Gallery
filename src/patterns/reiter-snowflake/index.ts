import type { Pattern } from '../../types/pattern'
import { createReiterSnowflakeRenderer } from './renderer'

export const reiterSnowflake: Pattern = {
  id: 'reiter-snowflake',
  title: 'Reiter Snowflake',
  category: 'Crystalline',
  blurb:
    'A hexagonal cellular automaton modelling vapor diffusion and freezing. Tweak α, β, γ to coax different snowflake morphologies.',
  params: [
    {
      type: 'number',
      name: 'alpha',
      label: 'α (diffusion)',
      description: 'Diffusion rate of vapor between non-frozen cells.',
      min: 0.5,
      max: 2.5,
      step: 0.05,
      default: 1.0,
    },
    {
      type: 'number',
      name: 'beta',
      label: 'β (background vapor)',
      description: 'Initial water-vapor density across the grid.',
      min: 0.3,
      max: 0.9,
      step: 0.01,
      default: 0.4,
    },
    {
      type: 'number',
      name: 'gamma',
      label: 'γ (vapor addition)',
      description: 'Constant vapor input to receptive cells per step.',
      min: 0,
      max: 0.01,
      step: 0.0005,
      default: 0.001,
    },
    {
      type: 'number',
      name: 'gridSize',
      label: 'grid size',
      description: 'Side length in hex cells. Higher = finer detail, slower.',
      min: 80,
      max: 240,
      step: 20,
      default: 160,
    },
  ],
  createRenderer: createReiterSnowflakeRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 2,
  stepsPerFrame: 1,
}
