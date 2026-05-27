import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Tinkerbell map is a discrete-time 2D dynamical system whose orbit traces out a
        strange attractor reminiscent of a Disney pixie dust trail — hence the name. Its
        origin in the literature is folklore (it appeared in fractal imagery galleries before
        a formal publication); it is now a standard chaos-theory testbed.
      </p>
      <h3>Map</h3>
      <TeX
        block
        tex="\\begin{aligned} x_{n+1} &= x_n^2 - y_n^2 + a x_n + b y_n \\\\ y_{n+1} &= 2 x_n y_n + c x_n + d y_n \\end{aligned}"
      />
      <p>
        Note the first three terms in <TeX tex="x_{n+1}" /> and the first two in{' '}
        <TeX tex="y_{n+1}" />: those are the real and imaginary parts of{' '}
        <TeX tex="z^2" /> with <TeX tex="z = x + iy" />. The Tinkerbell map can be written as{' '}
        <TeX tex="z_{n+1} = z_n^2 + (a + ic) z_n + (b + id) \\bar{z_n}" /> — a Mandelbrot-style
        iteration with an extra antiholomorphic kick.
      </p>
      <h3>Standard chaotic parameters</h3>
      <TeX block tex="a = 0.9, \\quad b = -0.6013, \\quad c = 2.0, \\quad d = 0.5" />
      <p>
        At these values the orbit settles onto a strange attractor with
      </p>
      <ul>
        <li>
          Lyapunov exponent <TeX tex="\\lambda \\approx 0.18" /> (positive — chaotic).
        </li>
        <li>
          Box-counting dimension <TeX tex="\\approx 1.4" />.
        </li>
      </ul>
      <h3>Sensitivity</h3>
      <p>
        The Tinkerbell map is famously sensitive to <em>numerical</em> perturbations as well
        as initial-condition perturbations. Different floating-point implementations sometimes
        produce visibly different attractors due to the iterated squaring amplifying
        round-off. This sensitivity is a useful illustration that "chaos" includes
        sensitivity to representation, not just initial conditions.
      </p>
      <h3>Try sweeping</h3>
      <p>
        Slide <TeX tex="b" /> by ±0.05: the attractor grows new lobes, collapses to a
        period-7 orbit, then explodes back into chaos. The whole bifurcation diagram of the
        Tinkerbell map is a 4D object; you can take 2D slices by fixing two parameters and
        sweeping the others.
      </p>
    </>
  )
}
