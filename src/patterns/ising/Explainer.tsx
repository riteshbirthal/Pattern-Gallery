import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Ising model is the canonical model of phase transitions in statistical mechanics.
        Ernst Ising solved the 1D version in his 1924 PhD thesis and concluded (correctly) that
        it has no phase transition. Lars Onsager solved the 2D version in 1944 and showed it{' '}
        <em>does</em> — an exact, sharp phase transition at a calculable critical temperature.
      </p>
      <h3>The model</h3>
      <p>
        Each lattice site holds a spin <TeX tex="s_i \\in \\{-1, +1\\}" />. The energy is{' '}
      </p>
      <TeX block tex="E = -J \\sum_{\\langle i, j\\rangle} s_i s_j - h \\sum_i s_i" />
      <p>
        The first sum is over nearest-neighbor pairs: aligned neighbors lower the energy by{' '}
        <TeX tex="J" />. The second is an external magnetic field <TeX tex="h" /> biasing
        spins. Spins evolve toward thermal equilibrium at temperature{' '}
        <TeX tex="T" />, with each microstate weighted by{' '}
        <TeX tex="\\exp(-E / k_B T)" />.
      </p>
      <h3>Metropolis algorithm</h3>
      <p>
        We sample the equilibrium with the Metropolis-Hastings rule: pick a random site, compute
        the energy change <TeX tex="\\Delta E" /> from flipping it, and flip with probability{' '}
        <TeX tex="\\min(1, e^{-\\Delta E / T})" />. After many sweeps, the visited
        configurations match the Boltzmann distribution.
      </p>
      <h3>The critical temperature</h3>
      <p>
        Onsager proved that on the 2D square lattice with{' '}
        <TeX tex="J = 1, h = 0" />, the exact transition temperature is
      </p>
      <TeX block tex="T_c = \\frac{2}{\\ln(1 + \\sqrt{2})} \\approx 2.269" />
      <ul>
        <li>
          <strong>Below T<sub>c</sub>:</strong> spontaneous magnetization. The system picks one
          of the two ordered states (mostly + or mostly −) and stays there.
        </li>
        <li>
          <strong>At T<sub>c</sub>:</strong> scale-invariant fractal domain structure. The
          correlation length diverges; you see fluctuations on every scale. This is the regime
          conformal field theory was developed to describe.
        </li>
        <li>
          <strong>Above T<sub>c</sub>:</strong> disordered, snowy.
        </li>
      </ul>
      <h3>Why it matters</h3>
      <p>
        The 2D Ising model is the textbook example of a continuous phase transition with
        rigorously known critical exponents. It captures universality (different microscopic
        models share the same macroscopic critical behavior) and is the warm-up for almost all
        of statistical field theory. Tweak the temperature slider through 2.27 and watch the
        ordered domains dissolve.
      </p>
    </>
  )
}
