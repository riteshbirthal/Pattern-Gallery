import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Julia sets share the iteration{' '}
        <TeX tex="z_{n+1} = z_n^2 + c" /> with the Mandelbrot set, but flip the roles of the
        variables. Here <TeX tex="c" /> is fixed and we ask, for each starting{' '}
        <TeX tex="z_0" />, whether the orbit escapes.
      </p>
      <p>
        Each value of <TeX tex="c" /> picks out a completely different fractal. The Mandelbrot
        set is exactly the set of <TeX tex="c" /> for which the corresponding Julia set is
        connected — a beautiful structural link.
      </p>
      <p>
        Sweeping <TeX tex="c" /> around a circle{' '}
        <TeX tex="c(t) = r\,(\cos t + i \sin t)" /> with <TeX tex="r \approx 0.79" /> traces a
        family of dramatically different shapes — try the "orbit c" toggle.
      </p>
    </>
  )
}
