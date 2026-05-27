export default function Explainer() {
  return (
    <>
      <p>
        Thomas Schelling published this model in 1971 to study how individual preferences scale
        up to collective outcomes. He won the 2005 Nobel in Economics for related work.
      </p>
      <h3>Setup</h3>
      <p>
        A grid contains agents of two types (here: blue and orange) and some empty cells. Each
        agent looks at its 8 neighbors. If the fraction of same-type neighbors is below the{' '}
        <strong>tolerance threshold</strong>, the agent is "unhappy" and moves to a random
        empty cell. Repeat until everyone is happy.
      </p>
      <h3>The counterintuitive result</h3>
      <p>
        Set the tolerance to <strong>30%</strong> — meaning agents are perfectly content as
        long as roughly a third of their neighbors are similar (so they tolerate being a
        minority within their own neighborhood). Run the simulation. You will see the grid
        sort itself into <strong>large segregated clusters</strong>, with most agents
        surrounded by 70-90% of their own type.
      </p>
      <p>
        Schelling's point: extreme segregation can emerge from agents who individually have only
        very mild same-group preferences. The macro outcome looks nothing like the micro
        preference. He used this to argue that observed segregation in cities is not
        necessarily evidence that individuals are extremely racist — modest individual biases,
        iterated through movement, suffice.
      </p>
      <h3>Phase transition</h3>
      <p>
        Sweep tolerance from 0 to 1. Below ~25% agents shrug at any neighborhood and you get
        random salt-and-pepper. Above ~70% nobody can ever be happy and the system thrashes
        forever. In the wide middle band, sharp segregation reliably emerges.
      </p>
      <h3>The legacy</h3>
      <p>
        This is one of the founding examples of agent-based modeling: simple individual rules
        producing emergent macroscopic structure that no individual chose. The same dynamic
        appears in opinion polarization, economic clustering, gentrification, and
        homophily-driven network formation.
      </p>
    </>
  )
}
