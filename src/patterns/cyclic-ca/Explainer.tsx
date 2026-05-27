import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        David Griffeath's cyclic cellular automaton (1988) gives every cell a state from{' '}
        <TeX tex="\\{0, 1, \\ldots, n-1\\}" /> arranged in a cycle. The update rule:
      </p>
      <ol>
        <li>
          Look at the cell's current state <TeX tex="s" />.
        </li>
        <li>
          The "successor" state is <TeX tex="(s + 1) \\bmod n" />.
        </li>
        <li>
          Count neighbors that are in the successor state. If at least{' '}
          <TeX tex="T" /> neighbors are in successor state, advance; otherwise stay.
        </li>
      </ol>
      <h3>Why spirals?</h3>
      <p>
        From random noise, three regimes emerge in succession:
      </p>
      <ol>
        <li>
          <strong>Demolition phase:</strong> small clumps of consecutive states wipe each other
          out.
        </li>
        <li>
          <strong>Defect phase:</strong> open zones with rotating "defects" (state mismatches at
          boundaries).
        </li>
        <li>
          <strong>Spiral phase:</strong> defects organize into stable rotating spirals that
          eventually fill the whole grid.
        </li>
      </ol>
      <p>
        The spirals are remarkable: nothing in the rule prefers rotation, yet they are the only
        long-term stable pattern. This is the same self-organization seen in real chemical
        oscillators (Belousov-Zhabotinsky reaction) and electrically excitable tissue (cardiac
        muscle).
      </p>
      <h3>Try</h3>
      <ul>
        <li>
          <TeX tex="n = 14, T = 3" /> with Moore — the classical Griffeath setup, fast spirals.
        </li>
        <li>
          <TeX tex="n = 4, T = 1" /> — fast but noisy demolition.
        </li>
        <li>
          <TeX tex="n = 8, T = 2" /> with von Neumann — slow, square-ish patterns.
        </li>
      </ul>
    </>
  )
}
