import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>Two related families of parametric curves with very different histories.</p>
      <h3>Rose curves</h3>
      <p>In polar coordinates,</p>
      <TeX block tex="r(\\theta) = \\cos(k\\,\\theta)" />
      <p>
        produces a "rose" with <TeX tex="k" /> petals if <TeX tex="k" /> is odd, and{' '}
        <TeX tex="2k" /> petals if <TeX tex="k" /> is even. Fractional <TeX tex="k" /> traces
        out a star-shaped pattern that closes only after multiple revolutions — try{' '}
        <TeX tex="k = 5/3" /> for a 15-petal star.
      </p>
      <h3>Spirograph (hypotrochoid)</h3>
      <p>
        Roll a small circle of radius <TeX tex="r" /> inside a big circle of radius{' '}
        <TeX tex="R" />. Place a pen at distance <TeX tex="d" /> from the small circle's center.
        The pen traces:
      </p>
      <TeX
        block
        tex={`\\begin{aligned}
x(t) &= (R - r)\\cos t + d\\cos\\!\\big(\\tfrac{R - r}{r}\\,t\\big) \\\\
y(t) &= (R - r)\\sin t - d\\sin\\!\\big(\\tfrac{R - r}{r}\\,t\\big)
\\end{aligned}`}
      />
      <p>
        The curve closes after <TeX tex="r / \\gcd(R, r)" /> revolutions of <TeX tex="t" />.
        That fraction determines how many lobes you get and how dense the result looks.
      </p>
      <p>
        This is the math behind the Spirograph toy (Denys Fisher, 1965) — and the same equation
        that astronomers used to describe Mars's apparent retrograde motion in geocentric
        cosmology. Geometry sneaks into a lot of unexpected places.
      </p>
      <h3>Try</h3>
      <ul>
        <li>
          Spirograph with <TeX tex="R = 96, r = 38, d = 28" />.
        </li>
        <li>
          <TeX tex="R = 100, r = 33, d = 60" /> — narrow petals.
        </li>
        <li>
          Rose <TeX tex="k = 7" /> — seven-petal symmetry.
        </li>
      </ul>
    </>
  )
}
