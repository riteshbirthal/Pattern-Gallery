import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Helmut Vogel's 1979 model places the <TeX tex="n" />-th seed in a sunflower disk at:
      </p>
      <TeX block tex="r_n = c\sqrt{n}, \qquad \theta_n = n\,\varphi" />
      <p>
        The choice of <TeX tex="\varphi" /> is everything. Plants use the <strong>golden
        angle</strong>:
      </p>
      <TeX block tex="\varphi = 360^\circ \cdot (1 - 1/\Phi) \approx 137.508^\circ" />
      <p>
        where <TeX tex="\Phi = (1 + \sqrt 5)/2" /> is the golden ratio. Why? Because <TeX
        tex="\Phi" /> is the "most irrational" number — it has the slowest converging continued
        fraction expansion of any irrational. That slow convergence means no rational
        approximation works well, so seeds placed at this angle never line up into radial
        spokes — the pack is maximally uniform.
      </p>
      <p>
        Move the slider just <em>0.1° away</em> from the golden angle. Spirals immediately appear
        because the angle is now too close to a rational fraction of <TeX tex="2\pi" />.
      </p>
      <p>
        The visible Fibonacci-numbered spirals (often 21 and 34, or 34 and 55) emerge from this
        single rule with no programming of "make spirals."
      </p>
    </>
  )
}
