export default function Explainer() {
  return (
    <>
      <p>
        Wave Function Collapse is a constraint-propagation algorithm published by Maxim Gumin in
        2016. The name borrows quantum-mechanical imagery: each grid cell is initially a
        "superposition" of every tile in the tileset; collapsing one cell to a definite tile
        propagates constraints to its neighbours, like the collapse of a wave function on
        measurement. The metaphor is loose but the algorithm is delightfully concrete.
      </p>
      <h3>The algorithm</h3>
      <ol>
        <li>
          Each cell holds a bitmask of tiles still legal there. Initially: all tiles.
        </li>
        <li>
          Pick the cell with the lowest <em>entropy</em> (fewest remaining options) — this is
          the "minimum-remaining-values" heuristic from constraint satisfaction.
        </li>
        <li>
          Collapse it: pick one of its remaining tiles randomly (optionally weighted) and fix
          it.
        </li>
        <li>
          Propagate the consequences via wavefront updates. A neighbour can keep tile{' '}
          <em>t</em> only if at least one of the just-collapsed cell's surviving tiles fits
          alongside <em>t</em>.
        </li>
        <li>
          If any cell loses all options (a contradiction), backtrack — or, in the simpler
          implementation here, restart.
        </li>
        <li>
          Repeat until every cell is collapsed.
        </li>
      </ol>
      <h3>Why it is so popular</h3>
      <p>
        WFC produces locally coherent, globally varied output from a tiny tileset and adjacency
        rules — exactly what game-world generators need. <em>Bad North</em>, <em>Caves of
        Qud</em>, <em>Townscaper</em>, and many indie titles use WFC for terrain, room layouts,
        or city blocks. The 2016 source release on GitHub spawned an entire community of
        derivatives (Markov-junior, model-synthesis, etc.).
      </p>
      <h3>What you see</h3>
      <p>
        We use a small handcrafted tileset of 12 path tiles: empty, straights, corners,
        T-junctions, and a four-way cross, with edges labelled <em>path</em> or{' '}
        <em>empty</em>. The only adjacency rule is "edges must match." Watch the lowest-entropy
        cells collapse one at a time and the path network grow as a coherent network.
      </p>
    </>
  )
}
