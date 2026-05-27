import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The logistic map is the simplest possible nonlinear dynamical system that can produce
        chaos:
      </p>
      <TeX block tex="x_{n+1} = r\\,x_n\\,(1 - x_n)" />
      <p>
        Originally a model of population dynamics — <TeX tex="r" /> is the reproduction rate,{' '}
        <TeX tex="x" /> the population fraction — it secretly contains an entire taxonomy of
        dynamical behavior.
      </p>
      <h3>How the diagram is drawn</h3>
      <p>
        For each <TeX tex="r" /> on the horizontal axis, iterate the map starting from{' '}
        <TeX tex="x_0 = 0.5" />. Discard the first few hundred iterates ("transient") so the
        orbit settles. Then plot the next several hundred iterate values vertically. What you see
        on each vertical slice is the <strong>attractor</strong> of the system at that{' '}
        <TeX tex="r" />.
      </p>
      <h3>What the picture shows</h3>
      <ul>
        <li>
          <TeX tex="0 \\le r &lt; 1" /> — the population dies, attractor = <TeX tex="0" />.
        </li>
        <li>
          <TeX tex="1 \\le r &lt; 3" /> — single fixed point <TeX tex="(r-1)/r" />.
        </li>
        <li>
          <TeX tex="r \\approx 3" /> — first <strong>period doubling</strong>: orbit alternates
          between two values.
        </li>
        <li>
          <TeX tex="r \\approx 3.449" /> — period 4.
        </li>
        <li>
          <TeX tex="r \\approx 3.544" /> — period 8.
        </li>
        <li>
          <TeX tex="r \\approx 3.5699" /> — Feigenbaum's accumulation point: <strong>chaos</strong>{' '}
          begins.
        </li>
        <li>
          Within the chaos: bright vertical "windows" of regular behavior — most famously, a
          period-3 window near <TeX tex="r \\approx 3.83" />.
        </li>
      </ul>
      <h3>Feigenbaum's constants</h3>
      <p>
        Mitchell Feigenbaum noticed in 1975 that the ratio of successive bifurcation intervals
        approaches a universal constant:
      </p>
      <TeX block tex="\\delta = \\lim_{n\\to\\infty} \\frac{r_n - r_{n-1}}{r_{n+1} - r_n} \\approx 4.6692\\ldots" />
      <p>
        Astonishingly, this <em>same</em> constant governs period-doubling routes to chaos in
        wildly different systems — dripping faucets, electronic oscillators, lasers. It is one
        of the deepest unifying numbers in nonlinear dynamics.
      </p>
    </>
  )
}
