import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        In 1904 Helge von Koch published <em>"Sur une courbe continue sans tangente, obtenue
        par une construction géométrique élémentaire"</em> ("On a continuous curve without
        tangent, obtained from elementary geometry") — one of the earliest explicit
        constructions of a curve that is everywhere continuous but nowhere differentiable. It
        was, scandalously, very simple.
      </p>
      <h3>Construction</h3>
      <p>
        Start with an equilateral triangle. Replace every straight edge with four edges of
        length 1/3 the original, arranged so the middle two form an outward equilateral bump:
      </p>
      <pre style={{ background: '#0f1117', padding: '0.5em', overflow: 'auto' }}>
{`Before:    A ────────────── B
After:     A ──── /\\ ──── B   (four segments, each 1/3 the original length)`}
      </pre>
      <p>
        Repeat for every segment, forever. The limit is the Koch snowflake.
      </p>
      <h3>Pathological properties</h3>
      <ul>
        <li>
          <strong>Infinite perimeter.</strong> Each iteration multiplies the segment count by 4
          and the segment length by 1/3, so the total perimeter is{' '}
          <TeX tex="3 \\cdot (4/3)^n" /> — diverges.
        </li>
        <li>
          <strong>Finite area.</strong> The added bumps shrink fast enough that the area
          converges to <TeX tex="\\frac{2\\sqrt{3}}{5}" /> times the area of the original
          triangle.
        </li>
        <li>
          <strong>Nowhere differentiable.</strong> Every point has a corner at every scale; you
          cannot draw a tangent line.
        </li>
        <li>
          <strong>Hausdorff dimension</strong>{' '}
          <TeX tex="D = \\log 4 / \\log 3 \\approx 1.262" />.
        </li>
      </ul>
      <h3>Why it mattered</h3>
      <p>
        Before Koch (and Weierstrass, who had a non-geometric example in 1872), mathematicians
        had widely believed that "reasonable" continuous functions were differentiable almost
        everywhere. Koch's curve was a clean, visual counterexample that helped force the
        modern, much more careful understanding of continuity, dimension, and measure.
      </p>
      <p>
        The "anti-snowflake" variant has bumps pointing inward — same edge formula, but with the
        chevron rotation reversed. Same fractal dimension, very different shape.
      </p>
    </>
  )
}
