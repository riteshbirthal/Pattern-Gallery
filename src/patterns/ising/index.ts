import type { Pattern } from '../../types/pattern'
import { createIsingRenderer } from './renderer'

export const ising: Pattern = {
  id: 'ising',
  title: 'Ising Model',
  category: 'Cellular Automata',
  blurb:
    "Ernst Ising's 1924 model of a ferromagnet — spins on a lattice that prefer to align. The 2D version (Onsager 1944) has an exact phase transition at T ≈ 2.269. Watch domain walls form, fluctuate, and freeze.",
  params: [
    {
      type: 'number',
      name: 'T',
      label: 'temperature T (J/k_B units)',
      description: 'Critical T_c ≈ 2.269. Above: disorder. Below: ordered domains.',
      min: 0.5,
      max: 5,
      step: 0.05,
      default: 2.27,
    },
    {
      type: 'number',
      name: 'h',
      label: 'external field h',
      min: -1,
      max: 1,
      step: 0.05,
      default: 0,
    },
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
      type: 'boolean',
      name: 'coldStart',
      label: 'cold start (all up)',
      default: false,
    },
  ],
  createRenderer: createIsingRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 2,
}
