export default function Explainer() {
  return (
    <>
      <p>
        Christopher Langton's ant (1986) is the simplest 2D Turing machine that produces
        emergent complexity. The rules:
      </p>
      <ul>
        <li>The ant sits on a square of a grid, facing N/E/S/W.</li>
        <li>
          On a <strong>white</strong> square: turn 90° right, flip the square to black, step
          forward.
        </li>
        <li>
          On a <strong>black</strong> square: turn 90° left, flip the square to white, step
          forward.
        </li>
      </ul>
      <p>That's the entire program. What happens?</p>
      <h3>Three phases</h3>
      <ol>
        <li>
          <strong>Simple symmetry</strong> (steps 1–~200): the trail looks regular and pretty.
        </li>
        <li>
          <strong>Chaos</strong> (~200–~10,000): the trail becomes a chaotic blob with no visible
          structure.
        </li>
        <li>
          <strong>Highway</strong> (~10,000+): the ant <em>spontaneously</em> starts building a
          recurring 104-step pattern that translates diagonally forever.
        </li>
      </ol>
      <p>
        It is a longstanding theorem that the ant's trajectory is unbounded — but we have no
        idea why the highway always emerges. Every initial finite grid configuration tested has
        yielded a highway eventually. Why?
      </p>
      <h3>Multi-state ants</h3>
      <p>
        Generalize: instead of just <code>RL</code>, allow <em>n</em> cell states with a turn
        sequence like <code>LRRRRRLLR</code>. The cell state advances by 1 (mod n) each visit.
        Different sequences produce strikingly different long-term behavior:
      </p>
      <ul>
        <li>
          <code>RL</code> — emergent highway
        </li>
        <li>
          <code>RLR</code> — fills a growing square
        </li>
        <li>
          <code>LLRR</code> — symmetric growth
        </li>
        <li>
          <code>LRRRRRLLR</code> — produces a smooth approximation of a cardioid
        </li>
      </ul>
    </>
  )
}
