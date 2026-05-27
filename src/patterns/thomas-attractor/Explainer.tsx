import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Belgian physicist René Thomas published this attractor in 1999 as an example of
        "labyrinth chaos": a minimal flow whose trajectories wander through a nominally
        space-filling 3D maze formed by intersecting nullclines of sine functions.
      </p>
      <h3>System</h3>
      <TeX
        block
        tex="\\dot{x} = \\sin(y) - bx, \\quad \\dot{y} = \\sin(z) - by, \\quad \\dot{z} = \\sin(x) - bz"
      />
      <p>
        The three equations are cyclically symmetric. The <TeX tex="\\sin" /> terms
        introduce an infinite lattice of fixed points (wherever{' '}
        <TeX tex="\\sin(\\cdot) = bx" /> is satisfied componentwise). The trajectory hops
        between regions surrounding nearby fixed points like a particle in an infinite
        labyrinth.
      </p>
      <h3>The transition to chaos</h3>
      <p>
        The damping <TeX tex="b" /> is the only parameter. As you decrease it from large
        values:
      </p>
      <ul>
        <li>
          <TeX tex="b > 1" />: the linear term dominates; orbits spiral monotonically into the
          origin.
        </li>
        <li>
          <TeX tex="b \\approx 0.32" />: stable limit cycle.
        </li>
        <li>
          <TeX tex="b \\approx 0.208265" />: <strong>onset of chaos</strong> via the standard
          period-doubling cascade.
        </li>
        <li>
          <TeX tex="b \\to 0" />: the damping vanishes and the system becomes conservative —
          trajectories never settle and explore an infinite labyrinth.
        </li>
      </ul>
      <h3>Why "labyrinth"</h3>
      <p>
        Without damping, equilibria of <TeX tex="\\sin" /> form a periodic 3D grid, and the
        flow lines naturally wind through the spaces between them. With small damping, the
        trajectory mostly settles into local pockets but tunnels chaotically between them. The
        net trajectory plot looks like a tangled walk through a 3D hedge maze.
      </p>
      <h3>Conservative limit</h3>
      <p>
        At <TeX tex="b = 0" /> the divergence{' '}
        <TeX tex="\\nabla \\cdot \\mathbf{F} = 0" /> identically — the system is conservative,
        so volume in phase space is preserved. This is unusual for a "chaotic attractor": with
        zero damping, the trajectory is a hyperchaotic random walk on the entire 3-torus, not
        an attractor. Tiny damping reveals the attractor structure beautifully.
      </p>
    </>
  )
}
