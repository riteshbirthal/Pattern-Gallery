import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Newton's method finds roots of <TeX tex="f(z) = 0" /> by iterating
      </p>
      <TeX block tex="z_{k+1} = z_k - \\alpha\\,\\frac{f(z_k)}{f'(z_k)}" />
      <p>
        For real-valued <TeX tex="f" /> on the line, this is the familiar tangent-following
        algorithm. Push it into the complex plane with{' '}
        <TeX tex="f(z) = z^n - 1" />, and something extraordinary happens.
      </p>
      <p>
        The polynomial has <TeX tex="n" /> roots — the <TeX tex="n" />-th roots of unity, evenly
        spaced on the unit circle. Each starting point <TeX tex="z_0" /> in the plane will
        converge to <em>one</em> of those roots — but to which one?
      </p>
      <p>
        Color every pixel by its destination root, modulated by how fast it converged. The result
        is a stunning fractal: regions of clean color (basins of attraction) separated by{' '}
        <strong>fractal boundaries</strong> where the answer is unstable. Tiny shifts in starting
        position can flip you between basins arbitrarily.
      </p>
      <h3>Things to try</h3>
      <ul>
        <li>
          Increase <TeX tex="n" /> to 5, 6, 7, 8 — more roots, more petals.
        </li>
        <li>
          Set relaxation <TeX tex="\\alpha &gt; 1" /> ("over-relaxed") — basins fragment into
          chaos.
        </li>
        <li>
          Set <TeX tex="\\alpha &lt; 1" /> for damped, gentler convergence.
        </li>
      </ul>
      <p>
        The boundary is famously <em>not</em> a Julia set, but a related object — every point on
        it is on the boundary of <em>all three</em> (or all <TeX tex="n" />) basins
        simultaneously.
      </p>
    </>
  )
}
