import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Michel Hénon proposed his map in 1976 as a discrete-time analog of the Lorenz system —
        the simplest possible 2D iterated map with quadratic nonlinearity that exhibits chaos:
      </p>
      <TeX
        block
        tex={`\\begin{aligned}
x_{n+1} &= 1 - a\\,x_n^2 + y_n \\\\
y_{n+1} &= b\\,x_n
\\end{aligned}`}
      />
      <p>
        With <TeX tex="(a, b) = (1.4, 0.3)" /> the orbit settles onto a <strong>strange
        attractor</strong>: a thin boomerang-shaped set that has zero area but positive Hausdorff
        dimension (~1.26). It is fractal — but it's much more than that.
      </p>
      <h3>Cantor structure</h3>
      <p>
        Zoom in on what looks like a line on the attractor. You'll see it's actually two parallel
        lines. Zoom in on one of those — it's two parallel lines too. And so on, ad infinitum.
        The attractor has <strong>Cantor cross-section</strong>: it is locally the product of a
        smooth curve and a Cantor set.
      </p>
      <p>
        This is the universal signature of "stretching plus folding": the map stretches the
        plane, then folds it back into itself, like kneading dough. After infinitely many
        iterations, the dough has uncountably many distinct layers.
      </p>
      <h3>Try</h3>
      <ul>
        <li>
          <TeX tex="(a, b) = (1.4, 0.3)" /> — the canonical Hénon attractor.
        </li>
        <li>
          <TeX tex="a = 1.0" /> — period-2 attractor (just two points).
        </li>
        <li>
          <TeX tex="a = 1.07" /> — period-4.
        </li>
        <li>
          Sweep <TeX tex="a" /> from 1.0 to 1.4 with <TeX tex="b = 0.3" /> — watch the
          period-doubling cascade culminate in chaos.
        </li>
      </ul>
    </>
  )
}
