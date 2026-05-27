export default function Explainer() {
  return (
    <>
      <p>
        Norman Margolus introduced this neighborhood structure in 1984 as a way to design
        cellular automata that exactly conserve quantities (energy, momentum, particle count)
        and that can be run backwards. Standard CA neighborhoods (Moore, von Neumann) make
        reversibility hard; the Margolus neighborhood makes it trivial.
      </p>
      <h3>The trick</h3>
      <p>
        Partition the grid into non-overlapping 2×2 blocks. The rule is a function from the 16
        possible block contents to the 16 possible block contents. To make the rule a
        bijection (and therefore reversible) you only need the 16-entry table to be a
        permutation of {`{0..15}`}. Symmetry is also easy to enforce.
      </p>
      <p>
        The key second ingredient: <strong>shift the partition</strong> by (1, 1) on alternate
        steps. Without the shift, no information would ever cross block boundaries. With it,
        every cell sees every neighbor over two consecutive steps.
      </p>
      <h3>Reversible computing</h3>
      <p>
        If your rule is a permutation, you can read the table backwards and run the universe in
        reverse. This is the foundation of <em>reversible computing</em> — Edward Fredkin and
        Tommaso Toffoli's research program at MIT in the 1980s, motivated by Landauer's
        principle that irreversible bit erasure dissipates a minimum thermodynamic cost{' '}
        of <em>kT ln 2</em> per bit.
      </p>
      <h3>The rules</h3>
      <ul>
        <li>
          <strong>Critters</strong>: Margolus's own showpiece. Reversible, time-symmetric, has a
          rich glider zoo. Ed Fredkin showed it is computationally universal.
        </li>
        <li>
          <strong>BBM (Billiard Ball Machine)</strong>: a model of computation with hard balls
          bouncing off mirrors. Reversible. Each bit is a ball trajectory, gates are arranged
          collisions.
        </li>
        <li>
          <strong>TM Gas (HPP-like lattice gas)</strong>: a discrete cousin of the
          Navier-Stokes equations. Used to simulate fluids in the 1970s.
        </li>
        <li>
          <strong>Tron</strong>: each block flips collectively if at least one cell is alive.
          Less famous, more wildly chaotic.
        </li>
      </ul>
      <h3>What you should see</h3>
      <p>
        At low density, Critters develops persistent gliders that scatter through their own
        wakes. BBM looks more like a particle gas. Increasing density past about 0.3 generally
        produces space-filling foam — the rules are reversible, so information never collapses,
        but it becomes too dense to read.
      </p>
    </>
  )
}
