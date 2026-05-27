import type { Pattern } from '../../types/pattern'
import { createDiamondSquareRenderer } from './renderer'

export const diamondSquare: Pattern = {
  id: 'diamond-square',
  title: 'Diamond-Square Terrain',
  category: 'Noise / Flow',
  blurb:
    "Fournier-Fussell-Carpenter 1982. Recursive midpoint displacement: pick the corners' average, perturb by a noise scaled by remaining detail. The original CGI mountain algorithm.",
  params: [
    {
      type: 'number',
      name: 'detail',
      label: 'detail (size = 2^d + 1)',
      min: 5,
      max: 9,
      step: 1,
      default: 8,
    },
    {
      type: 'number',
      name: 'roughness',
      label: 'roughness (Hurst H)',
      description: 'Lower = jagged, higher = rolling smooth hills. Controls fractal dimension.',
      min: 0.4,
      max: 1.5,
      step: 0.05,
      default: 0.85,
    },
    {
      type: 'number',
      name: 'seedRange',
      label: 'seed amplitude',
      min: 0.5,
      max: 5,
      step: 0.1,
      default: 2,
    },
    {
      type: 'number',
      name: 'seaLevel',
      label: 'sea level',
      min: 0,
      max: 0.6,
      step: 0.01,
      default: 0.3,
    },
    { type: 'boolean', name: 'shading', label: 'slope shading', default: true },
  ],
  createRenderer: createDiamondSquareRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
