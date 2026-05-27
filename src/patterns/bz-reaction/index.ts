import type { Pattern } from '../../types/pattern'
import { createBZRenderer } from './renderer'

export const bzReaction: Pattern = {
  id: 'bz-reaction',
  title: 'Belousov-Zhabotinsky CA',
  category: 'Cellular Automata',
  blurb:
    "Gerhardt & Schuster's 1989 'hodgepodge machine' — a discrete CA that reproduces the famous oscillating-color spiral waves of the Belousov-Zhabotinsky chemical reaction. Excitable media, in 8-cell grayscale.",
  params: [
    {
      type: 'number',
      name: 'cellSize',
      label: 'cell size (px)',
      min: 1,
      max: 6,
      step: 1,
      default: 2,
    },
    {
      type: 'number',
      name: 'N',
      label: 'states (N)',
      description: 'Number of intermediate sickness levels.',
      min: 50,
      max: 400,
      step: 10,
      default: 200,
    },
    {
      type: 'number',
      name: 'k1',
      label: 'k₁',
      description: 'Healthy → sick rate divisor (lower = sicker faster).',
      min: 1,
      max: 10,
      step: 1,
      default: 3,
    },
    {
      type: 'number',
      name: 'k2',
      label: 'k₂',
      description: 'Healthy ← infection from fully sick neighbors.',
      min: 1,
      max: 10,
      step: 1,
      default: 3,
    },
    {
      type: 'number',
      name: 'g',
      label: 'g (recovery boost)',
      min: 1,
      max: 50,
      step: 1,
      default: 28,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'classic', label: 'Classic BZ' },
        { value: 'fire', label: 'Fire' },
        { value: 'mono', label: 'Grayscale' },
      ],
      default: 'classic',
    },
  ],
  createRenderer: createBZRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 2,
}
