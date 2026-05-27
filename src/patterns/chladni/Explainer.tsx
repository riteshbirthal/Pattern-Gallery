import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        In 1787 Ernst Chladni mounted a metal plate, sprinkled fine sand on it, and drew a violin
        bow across one edge. The plate vibrated at one of its resonant modes; the sand,
        repeatedly flung off the antinodes and finding rest on the stationary <em>nodal lines</em>,
        traced out exquisite geometric figures.
      </p>
      <p>
        For a square plate with free edges, a simple superposition that captures the
        symmetry-equivalent modes <TeX tex="(m, n)" /> and <TeX tex="(n, m)" /> is
      </p>
      <TeX
        block
        tex="\\Phi(x, y) = \\cos(m\\pi x)\\cos(n\\pi y) - \\cos(n\\pi x)\\cos(m\\pi y)"
      />
      <p>
        with coordinates normalized to <TeX tex="[0, 1]" />. The nodal lines are the zero set:{' '}
        <TeX tex="\\Phi(x, y) = 0" /> — these are the dark lines you see, and where the
        simulated sand grains accumulate.
      </p>
      <h3>Pattern catalog</h3>
      <ul>
        <li>
          <TeX tex="(m, n) = (1, 2)" /> — single arc.
        </li>
        <li>
          <TeX tex="(2, 3)" /> — flower of curves.
        </li>
        <li>
          <TeX tex="(3, 5)" /> — the famous "spider web".
        </li>
        <li>
          <TeX tex="(5, 7)" /> — dense lattice.
        </li>
        <li>
          When <TeX tex="m = n" />, the formula degenerates to zero everywhere and you see a
          uniform field.
        </li>
      </ul>
      <h3>Why these patterns?</h3>
      <p>
        The plate's wave equation under fixed boundary conditions admits a discrete family of
        eigenmodes — exactly like a vibrating string has discrete pitches, but in 2D. Each mode
        has its own nodal pattern. The sand makes the math visible: a physical proof that
        eigenfunctions of the Laplacian on a square live among us.
      </p>
    </>
  )
}
