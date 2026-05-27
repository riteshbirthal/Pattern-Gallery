export default function Explainer() {
  return (
    <>
      <p>
        Wireworld is a 4-state cellular automaton invented by Brian Silverman in 1987 to model
        the propagation of electrons through electronic circuits. It is a classic example of
        the principle that cellular automata can simulate digital logic — David Moore famously
        used Wireworld to build a fully functional Wireworld computer with a Turing-complete
        instruction set.
      </p>
      <h3>The four states</h3>
      <ul>
        <li>
          <strong>Empty</strong> (background).
        </li>
        <li>
          <strong>Conductor</strong> (copper-colored): a wire that may carry electrons.
        </li>
        <li>
          <strong>Electron head</strong> (blue): the leading edge of a current pulse.
        </li>
        <li>
          <strong>Electron tail</strong> (red): trails the head and acts as a refractory
          period, preventing the pulse from doubling back.
        </li>
      </ul>
      <h3>Transition rule</h3>
      <ul>
        <li>Empty → empty.</li>
        <li>Head → tail.</li>
        <li>Tail → conductor.</li>
        <li>
          Conductor → head <em>iff</em> exactly 1 or 2 of its 8 Moore neighbors are heads;
          otherwise stays conductor.
        </li>
      </ul>
      <p>
        The "1 or 2" rule is the key choice. Forbidding 3+ neighbors prevents wires from
        spuriously firing inside dense junctions, so the medium behaves like a wire instead of
        a flame front.
      </p>
      <h3>Why it computes</h3>
      <p>
        With this rule you can build wires (conductor strips), diodes (one-way junctions),
        clocks (loops that fire periodically), and the universal AND/OR/NOT gates. Combine those
        and you can construct flip-flops, registers, ALUs — eventually a complete CPU. Mark
        Owen's "WireWorld Computer" (2002) actually executes a small instruction set running
        Conway's Game of Life inside Wireworld inside our universe.
      </p>
      <p>
        The Turing-completeness of cellular automata had been established by John von Neumann,
        but Wireworld is the most pedagogically clean example you can run in a few hundred
        cells.
      </p>
    </>
  )
}
