import type { Pattern } from '../../types/pattern'
import { createBurningShipRenderer } from './renderer'

export const burningShip: Pattern = {
  id: 'burning-ship',
  title: 'Burning Ship Fractal',
  category: 'Fractals',
  blurb:
    "A Mandelbrot relative discovered by Michelitsch & Rössler in 1992. Take absolute values of the real and imaginary parts before squaring — and a fleet of fractal ships emerges from the flames.",
  params: [
    { type: 'number', name: 'cx', label: 'center x', min: -2, max: 2, step: 0.001, default: -0.4 },
    { type: 'number', name: 'cy', label: 'center y', min: -2, max: 2, step: 0.001, default: -0.5 },
    {
      type: 'number',
      name: 'zoom',
      label: 'zoom',
      min: 0.3,
      max: 5000,
      step: 0.1,
      default: 0.7,
    },
    {
      type: 'number',
      name: 'iterations',
      label: 'max iterations',
      min: 50,
      max: 1000,
      step: 25,
      default: 200,
    },
    {
      type: 'select',
      name: 'palette',
      label: 'palette',
      options: [
        { value: 'fire', label: 'Fire' },
        { value: 'ocean', label: 'Ocean' },
        { value: 'rainbow', label: 'Rainbow' },
      ],
      default: 'fire',
    },
  ],
  createRenderer: createBurningShipRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 60,
}
