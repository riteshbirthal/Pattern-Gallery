import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Sierpinski triangle is the prototypical self-similar fractal. Wacław Sierpiński
        described it in 1915, but it had appeared in mosaic floors in Italian cathedrals
        700 years earlier. It shows up under at least four wildly different constructions, all
        producing the same shape.
      </p>
      <h3>Geometric recursion</h3>
      <p>
        Take an equilateral triangle. Connect the midpoints of its three sides. The original
        triangle is now divided into 4 smaller equilateral triangles. Discard the central
        (downward-pointing) one. Recurse on each of the 3 remaining.
      </p>
      <h3>Iterated function system</h3>
      <p>
        Three contraction maps, each scaling by ½ and translating to a corner. Apply them
        repeatedly to any starting point and the orbit closure is the Sierpinski triangle. (See
        also the Chaos Game pattern in this gallery — that demonstrates this construction.)
      </p>
      <h3>Pascal's triangle mod 2</h3>
      <p>
        Compute Pascal's triangle and color each entry by its parity. The 1's form the
        Sierpinski triangle perfectly. (Lucas' theorem proves this: <TeX tex="\\binom{n}{k}" />{' '}
        is odd if and only if every binary digit of <TeX tex="k" /> is ≤ the corresponding digit
        of <TeX tex="n" />, which exactly matches the geometric recursion at depth log<sub>2</sub>{' '}
        n.)
      </p>
      <h3>Wolfram's Rule 90</h3>
      <p>
        The 1D elementary cellular automaton "rule 90" (each cell becomes the XOR of its two
        neighbors) starting from a single live cell produces a discrete Sierpinski triangle in
        space-time. So does the totalistic CA mod 2 in 2D.
      </p>
      <h3>The dimension</h3>
      <p>
        Three sub-copies, each scaled by 2:
      </p>
      <TeX block tex="D = \\frac{\\log 3}{\\log 2} \\approx 1.585" />
      <p>
        Less than 2 (so its area is zero), more than 1 (so it is more than just an edge). One of
        the cleanest illustrations of fractional dimension.
      </p>
    </>
  )
}
