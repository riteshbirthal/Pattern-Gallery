import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Roger Penrose's tilings (1974) cover the entire plane with just{' '}
        <strong>two shapes</strong>, yet never repeat — they are <em>aperiodic</em>. The
        shapes are based on the golden ratio:
      </p>
      <TeX block tex="\\varphi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1.618" />
      <p>
        Edges of the two rhombi (or, equivalently, the two Robinson triangles used here for
        construction) are in golden ratio. Their angles are multiples of <TeX tex="36°" />, which
        is why every Penrose tiling has a kind of fivefold symmetry — even though no exact
        translation maps the tiling onto itself.
      </p>
      <h3>Substitution / deflation</h3>
      <p>
        We build the tiling by <strong>recursive substitution</strong>. Start with 10 acute
        Robinson triangles arranged around the center. At each iteration, replace every triangle
        with smaller pieces:
      </p>
      <ul>
        <li>An acute triangle splits into one acute + one obtuse.</li>
        <li>An obtuse splits into one acute + two obtuse.</li>
      </ul>
      <p>
        After <TeX tex="n" /> levels, the number of tiles grows as <TeX tex="\\varphi^{2n}" />.
        In the limit, this generates a perfectly aperiodic Penrose pattern.
      </p>
      <h3>Why is this remarkable?</h3>
      <p>
        Until 1974, mathematicians thought "fivefold symmetry" was forbidden in tilings. Then
        Dan Shechtman discovered <strong>quasicrystals</strong> in 1982 — real metallic alloys
        whose atomic arrangement is exactly this kind of aperiodic tiling. He won the 2011
        Nobel Prize in Chemistry. The math came first, the matter followed.
      </p>
    </>
  )
}
