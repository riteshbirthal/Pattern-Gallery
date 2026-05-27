import type { Pattern } from '../../types/pattern'
import { createWolframCARenderer } from './renderer'

export const wolframCA: Pattern = {
  id: 'wolfram-ca',
  title: 'Wolfram 1D Cellular Automaton',
  category: 'Cellular Automata',
  blurb:
    'A 1D row of cells evolves over time, drawn as a 2D space-time diagram. Each of the 256 elementary rules paints a different texture — Rule 30 is chaotic, Rule 90 is a Sierpinski triangle, Rule 110 is Turing-complete.',
  params: [
    {
      type: 'number',
      name: 'rule',
      label: 'rule (0–255)',
      description: 'Wolfram code: 8-bit lookup of next-cell from 3-cell neighbourhood.',
      min: 0,
      max: 255,
      step: 1,
      default: 30,
    },
    {
      type: 'select',
      name: 'init',
      label: 'initial row',
      options: [
        { value: 'single', label: 'Single seed' },
        { value: 'random', label: 'Random' },
      ],
      default: 'single',
    },
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 1,
      max: 8,
      step: 1,
      default: 3,
    },
  ],
  createRenderer: createWolframCARenderer,
  explainer: () => import('./Explainer'),
  stepsPerFrame: 2,
}
