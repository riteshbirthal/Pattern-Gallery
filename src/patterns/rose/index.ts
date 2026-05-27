import type { Pattern } from '../../types/pattern'
import { createRoseRenderer } from './renderer'

export const rose: Pattern = {
  id: 'rose-spirograph',
  title: 'Rose & Spirograph',
  category: 'Geometry',
  blurb:
    "Two parametric families: rose curves r = cos(kθ) for petals, and the hypotrochoid that powered the Spirograph toy — a small circle rolling inside a big one with a pen offset.",
  params: [
    {
      type: 'select',
      name: 'mode',
      label: 'mode',
      options: [
        { value: 'rose', label: 'Rose curve r = cos(kθ)' },
        { value: 'spirograph', label: 'Spirograph (hypotrochoid)' },
      ],
      default: 'rose',
    },
    {
      type: 'number',
      name: 'kRose',
      label: 'rose k',
      description: 'Integer = petals; fraction = filigree.',
      min: 1,
      max: 12,
      step: 0.1,
      default: 5,
    },
    {
      type: 'number',
      name: 'bigR',
      label: 'spirograph R',
      min: 30,
      max: 200,
      step: 1,
      default: 96,
    },
    {
      type: 'number',
      name: 'smallR',
      label: 'spirograph r',
      min: 10,
      max: 100,
      step: 1,
      default: 38,
    },
    {
      type: 'number',
      name: 'd',
      label: 'spirograph pen offset d',
      min: -80,
      max: 80,
      step: 1,
      default: 28,
    },
    {
      type: 'number',
      name: 'samples',
      label: 'samples',
      min: 500,
      max: 8000,
      step: 100,
      default: 3000,
    },
    { type: 'boolean', name: 'animate', label: 'animate', default: true },
  ],
  createRenderer: createRoseRenderer,
  explainer: () => import('./Explainer'),
}
