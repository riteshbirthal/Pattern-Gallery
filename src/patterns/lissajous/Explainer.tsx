import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>A Lissajous figure is the trace of a point that oscillates simultaneously along two perpendicular axes:</p>
      <TeX block tex="\\begin{aligned} x(t) &= \\sin(a\\,t + \\delta) \\\\ y(t) &= \\sin(b\\,t) \\end{aligned}" />
      <p>
        Jules Antoine Lissajous studied them in 1857 by reflecting light off two perpendicular
        tuning-fork-mounted mirrors. The same curves appeared on every oscilloscope of the 20th
        century when feeding two signals into the X and Y inputs.
      </p>
      <h3>Reading the parameters</h3>
      <ul>
        <li>
          The ratio <TeX tex="a/b" /> determines the topology. If it's rational the curve closes
          into a knotted figure. If it's irrational, the trace never repeats — it fills a square
          densely.
        </li>
        <li>
          The phase <TeX tex="\\delta" /> changes the appearance: at <TeX tex="\\delta = 0" />,
          the curve degenerates to a line for <TeX tex="a = b" />; at{' '}
          <TeX tex="\\delta = 90°" />, you get a clean ellipse for <TeX tex="a = b = 1" />.
        </li>
        <li>
          The number of crossings on each axis equals <TeX tex="a" /> and <TeX tex="b" />{' '}
          respectively — a quick way to read the integer ratio of an unknown waveform pair.
        </li>
      </ul>
      <h3>Try these</h3>
      <ul>
        <li>
          <TeX tex="a = 1, b = 1, \\delta = 90°" /> — a circle.
        </li>
        <li>
          <TeX tex="a = 3, b = 4, \\delta = 90°" /> — Lissajous's defining example.
        </li>
        <li>
          <TeX tex="a = 5, b = 4" /> with phase animation — watch the curve "rotate" as
          phase drifts.
        </li>
        <li>
          <TeX tex="a = 7, b = 9" /> — dense lattice of intersections.
        </li>
      </ul>
    </>
  )
}
