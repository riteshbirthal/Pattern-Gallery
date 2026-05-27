export default function Explainer() {
  return (
    <>
      <p>
        Sébastien Truchet (a French priest and mathematician) studied this in 1704: take a single
        square tile design — say, a tile divided diagonally into one black and one white half —
        and tile a grid where each tile is independently rotated to one of the four orientations
        at random.
      </p>
      <p>
        The familiar modern variant uses a tile with two quarter-circle arcs in opposite corners.
        With only two orientations per tile, the random grid produces flowing, maze-like contours
        that wander all over the canvas — closed loops, long curves, junctions — all from purely
        local randomness.
      </p>
      <p>
        Three variants here:
      </p>
      <ul>
        <li>
          <strong>Arcs</strong> — Carlos Sequin's smith chart variant. Always continuous: every
          tile boundary connects.
        </li>
        <li>
          <strong>Lines</strong> — straight segments. Four orientations.
        </li>
        <li>
          <strong>Triangles</strong> — the original Truchet design. Forms diamonds, zigzags,
          stripes depending on the random draw.
        </li>
      </ul>
      <p>Click "Reset" to roll a new arrangement.</p>
    </>
  )
}
