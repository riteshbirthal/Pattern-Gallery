import type { Pattern } from '../../types/pattern'
import { createPascalModRenderer } from './renderer'

export const pascalMod: Pattern = {
  id: 'pascal-mod',
  title: 'Pascal Triangle mod n',
  category: 'Number Theory',
  blurb:
    "Édouard Lucas (1878) proved that binomial coefficients mod a prime p obey a self-similar pattern — colored Pascal triangles produce Sierpinski-like fractals whose structure encodes the prime factorization.",
  params: [
    { type: 'number', name: 'modulus', label: 'modulus', min: 2, max: 12, step: 1, default: 3 },
    { type: 'number', name: 'rows', label: 'rows', min: 32, max: 256, step: 8, default: 128 },
  ],
  createRenderer: createPascalModRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
