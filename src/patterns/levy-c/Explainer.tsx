import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Paul Lévy described this curve in 1938 in his paper{' '}
        <em>"Les courbes planes ou gauches et les surfaces composées de parties semblables au
        tout"</em>. Like the Koch curve, it is built by recursive line replacement, but the
        replacement is much sharper and the resulting fractal has a higher dimension.
      </p>
      <h3>Construction</h3>
      <p>
        Given a line segment from A to B, replace it with two new segments meeting at the apex
        of an isosceles right triangle built on AB. So a single segment becomes two segments,
        each of length <TeX tex="|AB| / \\sqrt{2}" />, joined at a 90° angle pointing to one
        side. Repeat for every segment.
      </p>
      <p>
        After <TeX tex="n" /> iterations there are <TeX tex="2^n" /> segments, each of length{' '}
        <TeX tex="2^{-n/2}" /> times the original. Total length grows like{' '}
        <TeX tex="(\\sqrt{2})^n" /> — diverges, as you'd expect from a space-filling-ish
        fractal.
      </p>
      <h3>Hausdorff dimension</h3>
      <TeX block tex="D = \\frac{\\log 2}{\\log\\sqrt{2}} = 2" />
      <p>
        The curve is dimension <em>exactly 2</em>: it densely fills a fattened C-shape in the
        plane, even though it never fully covers it. (Compare with the Koch snowflake at
        ~1.26.) But unlike a true space-filling curve, the Lévy C is not a continuous bijection
        from [0, 1] to a region — it is a continuous surjection that overlaps itself heavily.
      </p>
      <h3>The C shape</h3>
      <p>
        The limit set looks roughly like a fat letter "C" — the curve sweeps out a half-disk
        with a self-similar fractal interior. Higher iterations look ever more space-filling
        but never escape the bounding C.
      </p>
      <h3>Tweaking the angle</h3>
      <p>
        At 90° you get the classic Lévy C. Decreasing the apex angle gives a thinner curve
        (lower fractal dimension); increasing it produces broader sweeps and overlap. At 60°
        the construction matches the Koch curve construction (without the closing snowflake);
        at 180° the curve degenerates back to a line.
      </p>
    </>
  )
}
