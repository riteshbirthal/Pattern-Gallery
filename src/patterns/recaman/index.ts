import type { Pattern } from '../../types/pattern'
import { createRecamanRenderer } from './renderer'

export const recaman: Pattern = {
  id: 'recaman',
  title: "Recamán's Sequence",
  category: 'Number Theory',
  blurb:
    "Bernardo Recamán Santos (1991) defined a sequence by 'go back if you can, otherwise go forward'. Drawing each step as a semicircle produces a haunting, Numberphile-famous trail that may or may not visit every integer.",
  params: [
    { type: 'number', name: 'terms', label: 'terms', min: 50, max: 600, step: 10, default: 200 },
  ],
  createRenderer: createRecamanRenderer,
  explainer: () => import('./Explainer'),
  drawEvery: 1,
}
