import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Buddhabrot is a "shadow" of the Mandelbrot set. Same iteration{' '}
        <TeX tex="z_{n+1} = z_n^2 + c" />, same starting point <TeX tex="z_0 = 0" />, but a
        completely different rendering rule:
      </p>
      <ol>
        <li>
          Pick a random <TeX tex="c" /> in the complex plane.
        </li>
        <li>
          Iterate. If <TeX tex="c" /> is <strong>in</strong> the Mandelbrot set (orbit stays
          bounded), throw it away.
        </li>
        <li>
          If <TeX tex="c" /> is <strong>outside</strong> (orbit escapes to infinity), replay the
          orbit and increment a counter at every pixel the orbit visits before escaping.
        </li>
        <li>Keep doing this for millions of <TeX tex="c" /> values. The histogram converges.</li>
      </ol>
      <p>
        The Mandelbrot is a map of which c are bounded; the Buddhabrot is a map of where the
        unbounded c <em>spend their time</em> on the way to infinity. It is the ergodic-shadow
        dual of the Mandelbrot.
      </p>
      <h3>The 90° rotation</h3>
      <p>
        Conventionally the Buddhabrot is shown rotated 90° from the Mandelbrot. Why? Because in
        that orientation the bilateral symmetry of the Mandelbrot set's reflections about the
        real axis becomes a top/bottom symmetry, and the figure resembles a meditating Buddha:
        head at top, arms at sides, lotus posture below. The name (Melinda Green, 1993) was
        impossible to resist.
      </p>
      <h3>Anti-Buddhabrot, Nebulabrot</h3>
      <p>
        Plotting the orbits of <strong>bounded</strong> c (instead of escaping ones) gives the
        anti-Buddhabrot — a much smoother, less detailed cloud. Compositing three Buddhabrots
        rendered with different <TeX tex="\\text{maxIter}" /> values into the R, G, B channels
        (low-iter → red, high-iter → blue) produces the famous "Nebulabrot" image.
      </p>
      <h3>Why it's slow</h3>
      <p>
        The set has measure zero on the boundary, but most of the visual interest comes from
        orbits that nearly graze the boundary — which require thousands of iterations to confirm
        as escaping. Hitting the cardioid/period-2 bulb test up front (this implementation does)
        skips most of the obvious bounded points and roughly doubles throughput.
      </p>
    </>
  )
}
