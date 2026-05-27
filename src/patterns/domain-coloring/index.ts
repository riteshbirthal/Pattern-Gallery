import type { Pattern } from '../../types/pattern'
import { createDomainColoringRenderer } from './renderer'

export const domainColoring: Pattern = {
  id: 'domain-coloring',
  title: 'Domain Coloring',
  category: 'Complex Analysis',
  blurb:
    "Frank Farris (1998) named this technique for visualizing complex functions: hue = arg(f(z)), brightness = |f(z)|. Zeros become hue cycles; poles, anti-cycles. The Riemann zeta function's zeros along Re=1/2 light up beautifully.",
  params: [
    {
      type: 'select',
      name: 'fn',
      label: 'function',
      default: 'rational',
      options: [
        { value: 'identity', label: 'f(z) = z' },
        { value: 'square', label: 'f(z) = z²' },
        { value: 'cube', label: 'f(z) = z³' },
        { value: 'inverse', label: 'f(z) = 1/z' },
        { value: 'mobius', label: '(z-1)/(z+1)' },
        { value: 'rational', label: '(z³−1) / (z²+z+1)' },
        { value: 'sine', label: 'sin(z)' },
        { value: 'exp', label: 'exp(z)' },
        { value: 'gamma', label: 'Γ(z)' },
      ],
    },
    { type: 'number', name: 'range', label: 'view range', min: 1, max: 6, step: 0.25, default: 3 },
  ],
  createRenderer: createDomainColoringRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
