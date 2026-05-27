import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        All three fractals here come from the same recursive recipe: divide the square into a
        3×3 grid, keep some of the 9 subsquares, recurse on each. Different choices of which
        subsquares to keep produce dramatically different fractal dimensions.
      </p>
      <h3>Sierpinski carpet (1916)</h3>
      <p>
        Wacław Sierpiński's planar version of Cantor's middle-thirds set: keep all 8 outer
        squares, delete the center.
      </p>
      <TeX block tex="D_{\\text{carpet}} = \\frac{\\log 8}{\\log 3} \\approx 1.893" />
      <p>
        It is the universal plane curve — every compact subset of the plane embeds
        homeomorphically in the carpet. Used as the topology of certain quasi-fractal antennas
        because every band fits inside its self-similar structure.
      </p>
      <h3>T-square</h3>
      <p>
        A square has half-size copies placed at each of its four corners; recurse. The corners
        of the level-n iterations spell out the binary digits of <TeX tex="n" /> in a curious
        Gray-code-like pattern.
      </p>
      <TeX block tex="D_{\\text{T-square}} = 2" />
      <p>
        The T-square has full Hausdorff dimension 2 (it actually fills the plane in the limit)
        but is still a fractal because its <em>boundary</em> has dimension{' '}
        <TeX tex="D_{\\partial} = \\log 2 / \\log 2 + \\text{nontrivial} \\approx 1.5" />.
      </p>
      <h3>Vicsek fractal</h3>
      <p>
        Keep only the 5 sub-squares that form a plus sign (center + 4 axial); delete the 4
        corners.
      </p>
      <TeX block tex="D_{\\text{Vicsek}} = \\frac{\\log 5}{\\log 3} \\approx 1.465" />
      <p>
        Tamás Vicsek introduced this in 1983 as a model of cluster growth. Lower fractal
        dimension than the carpet, so it looks "thinner."
      </p>
      <h3>The general formula</h3>
      <p>
        For any of these (and the related Cantor dust, Menger sponge, etc.), the
        self-similarity dimension is{' '}
      </p>
      <TeX block tex="D = \\frac{\\log N}{\\log s}" />
      <p>
        where <TeX tex="s" /> is the linear scaling factor (3 here) and{' '}
        <TeX tex="N" /> is the number of sub-pieces kept (8, 4, 5 respectively).
      </p>
    </>
  )
}
