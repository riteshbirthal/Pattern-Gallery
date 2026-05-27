import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        A space-filling curve is a continuous map{' '}
        <TeX tex="f: [0, 1] \\to [0, 1]^2" /> whose <em>image</em> is the entire square. Cantor
        had shown earlier that the line segment and the unit square have the same cardinality,
        but his bijection was wildly discontinuous. In 1890 Giuseppe Peano constructed the first
        actually continuous example. The mathematical world was scandalized — clearly the naive
        idea of "dimension as how many directions you can move" needed refining.
      </p>
      <h3>How it works</h3>
      <p>
        At each level of recursion, divide the square into <TeX tex="b^2" /> sub-squares (b=2 for
        Hilbert, b=3 for Peano). Visit each sub-square in turn, traversing it by a smaller copy
        of the same curve. The trick is choosing rotations/reflections of the sub-curves so that
        the endpoint of one connects to the start of the next. The limit of this nested
        substitution is the space-filling curve.
      </p>
      <h3>Hilbert vs Peano</h3>
      <ul>
        <li>
          <strong>Hilbert (1891):</strong> base 2. Each square splits into 4. The curve is
          smoother, has nicer locality properties, and is the one used in practice (database
          indexing, image compression — adjacent points on the curve are usually adjacent in 2D
          too).
        </li>
        <li>
          <strong>Peano (1890):</strong> base 3. Each square splits into 9. Slightly older,
          slightly more "rumpled" looking. Historically the first.
        </li>
        <li>
          <strong>Moore:</strong> a closed-loop variant of the Hilbert curve — start and end
          coincide, so the curve is a topological circle inscribed onto the square.
        </li>
      </ul>
      <h3>Locality property</h3>
      <p>
        For any two points <TeX tex="t_1, t_2 \\in [0, 1]" /> with{' '}
        <TeX tex="|t_1 - t_2| < \\epsilon" />, the corresponding 2D points are at distance{' '}
        <TeX tex="O(\\sqrt{\\epsilon})" /> in the limit. This is why Hilbert curves are widely
        used as 1D indexes of 2D data: they preserve neighborhoods.
      </p>
      <h3>Fractal dimension</h3>
      <p>
        At any finite order the curve is just a polyline of length{' '}
        <TeX tex="\\propto b^n" /> (where <TeX tex="n" /> is the order), so it is a 1D object.
        But its <em>limit</em> has Hausdorff dimension exactly 2 — the curve fills the plane.
        Length goes to infinity at finite area; the curve "becomes" the square.
      </p>
    </>
  )
}
