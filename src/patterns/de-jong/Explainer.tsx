import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Peter de Jong's attractor — popularized by Clifford Pickover's <em>Computers, Pattern,
        Chaos and Beauty</em> — is given by:
      </p>
      <TeX
        block
        tex={`\\begin{aligned}
x_{n+1} &= \\sin(a\\,y_n) - \\cos(b\\,x_n) \\\\
y_{n+1} &= \\sin(c\\,x_n) - \\cos(d\\,y_n)
\\end{aligned}`}
      />
      <p>
        Like the Clifford map, four parameters carve a strange attractor in the plane. The
        difference is the use of <em>differences</em> of trig functions instead of sums — this
        tends to produce sharper edges and more rope-like filaments.
      </p>
      <h3>Some good seeds</h3>
      <ul>
        <li>
          <TeX tex="(1.4, -2.3, 2.4, -2.1)" /> — the default; a layered weave.
        </li>
        <li>
          <TeX tex="(1.641, 1.902, 0.316, 1.525)" /> — a ribbon coil.
        </li>
        <li>
          <TeX tex="(-2.7, -0.09, -0.86, -2.2)" /> — a hollow vortex.
        </li>
      </ul>
      <h3>Why does this work?</h3>
      <p>
        The map is bounded (sin and cos are bounded), but its Jacobian has eigenvalues that can
        stretch and fold. Stretching plus folding is the universal recipe for chaos: sensitivity
        to initial conditions plus a confined region, in which orbits revisit the same fractal
        skeleton over and over.
      </p>
    </>
  )
}
