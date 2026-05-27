import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Igor Gumowski and Christian Mira derived this map at CERN in the 1980s while studying
        long-term stability of particles in storage rings. They discovered that a simple area-
        preserving discrete-time map produces an extraordinary range of shapes — many of which
        look like beetles, butterflies, leaves, mandalas, or microscopic organisms.
      </p>
      <h3>The map</h3>
      <p>
        Define a nonlinearity:
      </p>
      <TeX block tex="f(x) = \\mu x + \\frac{2(1 - \\mu)\\,x^2}{1 + x^2}" />
      <p>The map iterates as:</p>
      <TeX
        block
        tex="\\begin{aligned} y_{n+1} &= b\\,y_n + f(x_n) \\\\ x_{n+1} &= -x_n + a(1 - \\sigma\\,y_{n+1}^2)\\,y_{n+1} + f(y_{n+1}) \\end{aligned}"
      />
      <p>
        with <TeX tex="\\sigma = 0.0098" /> and parameters{' '}
        <TeX tex="a, b, \\mu" /> that you can tune. When <TeX tex="b = 1" /> and{' '}
        <TeX tex="a = 0" />, the map is exactly area-preserving (Hamiltonian) — it represents
        a simplified accelerator one-turn map.
      </p>
      <h3>What it models</h3>
      <p>
        Gumowski-Mira originated as a stand-in for the dynamics of a charged particle in a
        circular accelerator: each iteration represents one turn around the ring; the
        nonlinearity captures the focusing and defocusing magnets. Stable orbits correspond to
        beam confinement. Chaotic regions correspond to particles that drift out and hit the
        beam pipe.
      </p>
      <h3>The shapes</h3>
      <p>
        The map produces an enormous variety of orbits depending on the three parameters. Try:
      </p>
      <ul>
        <li>
          <TeX tex="\\mu = -0.7" />: leaf-like rosettes (this is the default).
        </li>
        <li>
          <TeX tex="\\mu = 0.31" />: nested ovals.
        </li>
        <li>
          <TeX tex="\\mu = -0.2" />: butterfly silhouette.
        </li>
        <li>
          <TeX tex="\\mu = 0.7" />: nautilus shell.
        </li>
      </ul>
      <p>
        The <TeX tex="a, b" /> parameters bend the orbit; even tiny changes (third decimal) can
        dramatically reshape the figure. This is the appeal — and the headache — of the
        Gumowski-Mira system.
      </p>
    </>
  )
}
