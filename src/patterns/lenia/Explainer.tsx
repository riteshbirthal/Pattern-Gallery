import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        <strong>Lenia</strong> (Bert Chan, 2018) generalizes Conway's Game of Life along three
        axes:
      </p>
      <ul>
        <li>
          <strong>Continuous space:</strong> a much larger neighborhood, weighted by a smooth
          kernel.
        </li>
        <li>
          <strong>Continuous state:</strong> cells take values in <TeX tex="[0, 1]" />, not just{' '}
          <TeX tex="\\{0, 1\\}" />.
        </li>
        <li>
          <strong>Continuous time:</strong> a small time step <TeX tex="\\Delta t" /> instead of
          discrete generations.
        </li>
      </ul>
      <p>The update at each cell is</p>
      <TeX
        block
        tex="A_{t+\\Delta t} = \\mathrm{clip}_{[0,1]}\\!\\big(A_t + \\Delta t \\cdot G(K * A_t)\\big)"
      />
      <p>
        where <TeX tex="K" /> is a smooth annular convolution kernel and <TeX tex="G(\\cdot)" />{' '}
        is a bell-shaped growth function:
      </p>
      <TeX block tex="G(u) = 2\\,\\exp\\!\\left(-\\frac{(u - \\mu)^2}{2\\sigma^2}\\right) - 1" />
      <p>
        The kernel is a peaked ring (peaks at half-radius). The growth function returns{' '}
        <TeX tex="+1" /> when the local average is near <TeX tex="\\mu" /> (cell grows) and{' '}
        <TeX tex="-1" /> otherwise (cell decays).
      </p>
      <h3>Why it matters</h3>
      <p>
        With well-tuned parameters Lenia produces stable, mobile, self-organizing creatures
        ("orbium", "scutium", "gyrorbium") that look almost biological — with smoother dynamics
        than Conway can dream of. There's a whole <a href="https://chakazul.github.io/lenia.html" target="_blank" rel="noreferrer">zoo of Lenia organisms</a> catalogued on a continuous spectrum.
      </p>
      <p>
        This implementation runs on a 96×96 toroidal grid with kernel radius 13. Use{' '}
        <strong>μ ≈ 0.15</strong>, <strong>σ ≈ 0.017</strong>, <strong>dt ≈ 0.1</strong> for
        the orbium-like regime. Reset for new initial conditions — most random seeds collapse,
        but every now and then a creature crystallizes.
      </p>
    </>
  )
}
