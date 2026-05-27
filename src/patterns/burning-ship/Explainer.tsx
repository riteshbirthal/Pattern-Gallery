import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Mandelbrot iteration is{' '}
        <TeX tex="z_{n+1} = z_n^2 + c" />. Replace it with
      </p>
      <TeX block tex="z_{n+1} = (|\\,\\mathrm{Re}(z_n)| + i\\,|\\,\\mathrm{Im}(z_n)|)^2 + c" />
      <p>
        and you get the Burning Ship — a fractal set discovered by Michael Michelitsch and Otto
        Rössler in 1992, named for the unmistakable image of a smoldering ship that appears at
        the right zoom level.
      </p>
      <p>
        The absolute-value step breaks the analyticity of the Mandelbrot map: small filaments and
        appendages ("antennas") look angular and stratified rather than smoothly self-similar.
        That's because each <em>iterate</em> reflects across the axes whenever a coordinate goes
        negative — the fractal is no longer conformal, and you can see the cuts and folds that
        result.
      </p>
      <h3>Where to look</h3>
      <ul>
        <li>
          <strong>Main ship:</strong> default view. Pan slightly to see masts and rigging.
        </li>
        <li>
          <TeX tex="(-1.755, -0.029)" />, zoom 200 — a baby ship.
        </li>
        <li>
          <TeX tex="(-1.762, -0.0285)" />, zoom 2000 — exquisite filigree.
        </li>
        <li>
          Crank up iterations as you zoom in or you'll lose detail at the edges.
        </li>
      </ul>
    </>
  )
}
