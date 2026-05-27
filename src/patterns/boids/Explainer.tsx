export default function Explainer() {
  return (
    <>
      <p>
        Craig Reynolds proposed in 1987 that the elaborate behavior of bird flocks could be
        explained by three local rules followed independently by every bird ("boid"):
      </p>
      <ol>
        <li>
          <strong>Separation</strong> — steer to avoid crowding nearby flockmates. Strong at
          short range, weak at long range.
        </li>
        <li>
          <strong>Alignment</strong> — steer to match the average heading of nearby flockmates.
        </li>
        <li>
          <strong>Cohesion</strong> — steer toward the average position of nearby flockmates.
        </li>
      </ol>
      <p>
        Each rule produces a steering vector; they are weighted and summed to update each boid's
        velocity. There is no leader, no central planner, no shared knowledge of the flock as a
        whole — yet realistic flocking emerges, including the rolling V-shape, the splitting
        around obstacles, and the turbulent re-merging.
      </p>
      <h3>Why it matters</h3>
      <p>
        This was one of the earliest demonstrations that <em>complex global behavior</em> can be
        a generic consequence of <em>simple local rules</em> — a foundational idea in agent-based
        modeling, swarm robotics, and crowd simulation. Reynolds's boids were used in the
        Disney film <em>The Lion King</em> (the wildebeest stampede) and in the bat colonies of{' '}
        <em>Batman Returns</em>.
      </p>
      <h3>Things to try</h3>
      <ul>
        <li>
          Set <strong>separation = 0</strong>: boids collapse into a single point.
        </li>
        <li>
          Set <strong>alignment = 0, cohesion = 0</strong>: boids scatter and never coordinate.
        </li>
        <li>
          High <strong>vision radius</strong> + low <strong>separation radius</strong> = giant
          synchronized flock.
        </li>
        <li>
          Low <strong>vision radius</strong>: many small independent groups.
        </li>
      </ul>
    </>
  )
}
