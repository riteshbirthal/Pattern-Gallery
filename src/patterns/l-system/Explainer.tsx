export default function Explainer() {
  return (
    <>
      <p>
        Aristid Lindenmayer invented L-systems in 1968 to model plant growth. The trick is two
        steps:
      </p>
      <ol>
        <li>
          <strong>String rewriting.</strong> Start with an axiom (e.g. <code>F</code>). At each
          generation, every symbol is simultaneously replaced by a string per a rule table — for
          the Koch curve, <code>F → F+F-F-F+F</code>.
        </li>
        <li>
          <strong>Turtle graphics.</strong> Walk the final string left-to-right. <code>F</code>{' '}
          means draw a unit forward, <code>+</code> turns the turtle left, <code>-</code> turns
          right, <code>[</code> pushes the turtle's state on a stack, <code>]</code> pops.
        </li>
      </ol>
      <p>Examples in the dropdown:</p>
      <ul>
        <li>
          <strong>Koch curve</strong> — angle 90°, rule <code>F → F+F-F-F+F</code>.
        </li>
        <li>
          <strong>Dragon curve</strong> — paper-folding fractal, two rules over two symbols.
        </li>
        <li>
          <strong>Hilbert curve</strong> — space-filling: visits every pixel of a grid.
        </li>
        <li>
          <strong>Plant</strong> — uses <code>[</code> and <code>]</code> to branch, producing
          shrub-like structures.
        </li>
      </ul>
      <p>String length grows exponentially with iterations — keep iterations modest.</p>
    </>
  )
}
