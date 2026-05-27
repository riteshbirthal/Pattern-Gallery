import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Heighway dragon (or "dragon curve") was discovered by NASA physicists John Heighway,
        Bruce Banks, and William Harter in 1966 and popularized by Martin Gardner in 1967.
        Michael Crichton used it as the chapter divider in <em>Jurassic Park</em> (1990) — at
        each chapter break the dragon advances one iteration, mirroring the iterative chaos of
        the plot.
      </p>
      <h3>The paper-folding construction</h3>
      <p>
        Fold a strip of paper in half. Then in half again, in the same direction. Repeat{' '}
        <TeX tex="n" /> times. Now unfold every crease to exactly 90°. Lay the strip flat and
        you have the order-<TeX tex="n" /> Heighway dragon. The number of creases is{' '}
        <TeX tex="2^n - 1" />, and the sequence of left/right turns at each crease has a clean
        recursive structure:
      </p>
      <TeX block tex="T_{n+1} = T_n \\,||\\, [\\,1\\,] \\,||\\, \\overline{\\text{rev}(T_n)}" />
      <p>
        where <TeX tex="\\overline{\\,\\cdot\\,}" /> negates each turn. Equivalently, after the{' '}
        <TeX tex="k" />-th unit step the next turn is +1 if the bit one above the lowest set
        bit of <TeX tex="k" /> is 0, else −1.
      </p>
      <h3>Self-similarity</h3>
      <p>
        The order-<TeX tex="n" /> dragon equals two order-<TeX tex="(n-1)" /> dragons joined at
        a right angle (one rotated). Hence "dragon": an L-system, an IFS with two affine
        maps, and a paper fold all produce the same shape.
      </p>
      <h3>Tile of the plane</h3>
      <p>
        Most stunningly: in the limit, the dragon is a <em>tile of the plane</em> — copies of
        it (rotated by multiples of 90°) tile the entire plane without gaps or overlaps. So
        despite never crossing itself in any finite iteration, in the limit it perfectly fills
        2D space. Hausdorff dimension <TeX tex="D = 2" /> exactly; the boundary has dimension{' '}
        <TeX tex="\\log_2 \\lambda \\approx 1.5236" /> where{' '}
        <TeX tex="\\lambda" /> is the largest root of <TeX tex="x^4 = 2x^2 + 4" />.
      </p>
      <h3>Variants</h3>
      <ul>
        <li>
          <strong>Twin dragon</strong>: two dragons joined back-to-back form a single tile that
          alone tiles the plane (a Davis-Knuth twindragon).
        </li>
        <li>
          <strong>Terdragon</strong>: same construction but with 60° turns instead of 90°. Tiles
          the plane and has dimension exactly 2 with boundary{' '}
          <TeX tex="\\log_3 6 \\approx 1.6309" />.
        </li>
      </ul>
    </>
  )
}
