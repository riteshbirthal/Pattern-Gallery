export default function Explainer() {
  return (
    <>
      <p>
        Brian Silverman's "Brain" is a 3-state cellular automaton. Each cell is in one of three
        states:
      </p>
      <ul>
        <li>
          <strong>Off</strong> (dead)
        </li>
        <li>
          <strong>On</strong> (firing) — shown bright white
        </li>
        <li>
          <strong>Dying</strong> (refractory) — shown purple
        </li>
      </ul>
      <p>The transition rules:</p>
      <ol>
        <li>
          <strong>Off</strong> → <strong>On</strong> if exactly 2 of 8 Moore neighbors are{' '}
          <em>On</em>.
        </li>
        <li>
          <strong>On</strong> → <strong>Dying</strong> always.
        </li>
        <li>
          <strong>Dying</strong> → <strong>Off</strong> always.
        </li>
      </ol>
      <p>
        That's it — but the dynamics are radically different from Conway. The mandatory
        refractory phase prevents stable still-lifes; almost everything in Brian's Brain is in
        motion. The most striking result: random initial conditions reliably produce many{' '}
        <strong>spaceships</strong> — small recurring patterns that translate across the grid.
      </p>
      <h3>Why no still-lifes?</h3>
      <p>
        A still-life requires self-sustaining "On" cells, but every "On" cell must transition to
        "Dying" the next step. The only way the universe can persist is by passing the firing
        state from cell to cell — which is precisely what makes spaceships natural here.
      </p>
      <h3>Real-world analogy</h3>
      <p>
        The off / on / refractory cycle is exactly the model neuroscientists use for action
        potentials in axons: a neuron fires, then enters a refractory period during which it
        cannot fire again, then returns to rest. Brian's Brain is the simplest CA that captures
        wave propagation in excitable media.
      </p>
    </>
  )
}
