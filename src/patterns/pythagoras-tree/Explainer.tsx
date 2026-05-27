import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Albert E. Bosman, a Dutch mathematics teacher, drew this fractal by hand in 1942 while
        hidden during the German occupation. He had been inspired by the Pythagorean theorem.
        It is the first widely-known fractal to be explicitly designed for visual beauty rather
        than as a counterexample.
      </p>
      <h3>Construction</h3>
      <p>
        Start with a square (the "trunk"). On its top edge, build a right triangle with
        hypotenuse along that edge. On each of the triangle's two legs, build a new square.
        Recurse on each new square.
      </p>
      <p>
        If the right triangle has its right angle directly above the center, the tree is
        symmetric. Tilting that angle to one side produces leaning, curling, or skewed trees.
      </p>
      <h3>Pythagorean theorem</h3>
      <p>
        With base square of side <TeX tex="s" /> and triangle angle <TeX tex="\\alpha" />, the
        two child squares have sides <TeX tex="s\\cos\\alpha" /> and{' '}
        <TeX tex="s\\sin\\alpha" />. Their areas sum to{' '}
      </p>
      <TeX block tex="s^2\\cos^2\\alpha + s^2\\sin^2\\alpha = s^2" />
      <p>
        Exactly the Pythagorean theorem: every level of the tree carries the same total{' '}
        <strong>area</strong> as the trunk, regardless of <TeX tex="\\alpha" />. The fractal
        encodes the identity geometrically.
      </p>
      <h3>Bounding region</h3>
      <p>
        For 30° ≤ α ≤ 60°, the tree fits inside a 6w × 4w bounding rectangle (where w is the
        base width). Outside this band the squares overlap and the tree fills its bounding box;
        inside it, the tree is a self-avoiding fractal.
      </p>
      <h3>Symmetric tree (45°)</h3>
      <p>
        At <TeX tex="\\alpha = 45°" />, both children scale by{' '}
        <TeX tex="1/\\sqrt{2}" />. After <TeX tex="n" /> levels you have <TeX tex="2^n" />{' '}
        squares each scaled by <TeX tex="2^{-n/2}" />. The total square count grows
        exponentially while their total perimeter grows like <TeX tex="(\\sqrt{2})^n" /> —
        another classical "infinite perimeter, bounded shape" fractal.
      </p>
      <p>
        The Hausdorff dimension at 45° is exactly 2 — the tree fills its bounding region. At
        other angles it can be a self-similar fractal of strictly intermediate dimension.
      </p>
    </>
  )
}
