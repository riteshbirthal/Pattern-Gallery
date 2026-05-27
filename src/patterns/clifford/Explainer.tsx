import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Clifford attractor (Clifford Pickover, 1980s) is a deceptively simple iterated map of
        the plane:
      </p>
      <TeX
        block
        tex={`\\begin{aligned}
x_{n+1} &= \\sin(a\\,y_n) + c\\,\\cos(a\\,x_n) \\\\
y_{n+1} &= \\sin(b\\,x_n) + d\\,\\cos(b\\,y_n)
\\end{aligned}`}
      />
      <p>
        Start with any point. Apply the map a million times. The trajectory does not wander
        randomly — it is drawn back, again and again, to a thin invariant set: the{' '}
        <strong>strange attractor</strong>. Some <TeX tex="(a, b, c, d)" /> tuples produce
        translucent webs, others dense kernels, others fragile filigree.
      </p>
      <h3>How to read the picture</h3>
      <p>
        Every visited pixel is incremented in a counter buffer. Brightness is{' '}
        <TeX tex="\\log(1 + \\text{count})" /> normalized to the most-visited pixel — the eye
        sees regions the orbit lingers in.
      </p>
      <h3>Things to try</h3>
      <ul>
        <li>
          Sweep <TeX tex="a" /> from -2 to 2 with the others fixed — watch the topology change.
        </li>
        <li>
          <TeX tex="(a, b, c, d) = (-1.4, 1.6, 1.0, 0.7)" /> is a classic.
        </li>
        <li>
          Try <TeX tex="(1.5, -1.8, 1.6, 0.9)" /> for a very different feel.
        </li>
      </ul>
    </>
  )
}
