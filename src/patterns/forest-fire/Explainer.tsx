import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Bak, Chen and Tang's 1990 forest-fire model is a probabilistic CA with three states —{' '}
        <strong>empty</strong>, <strong>tree</strong>, <strong>burning</strong> — and only two
        free parameters:
      </p>
      <ul>
        <li>
          <TeX tex="p" /> — probability that an empty cell grows a tree this step.
        </li>
        <li>
          <TeX tex="f" /> — probability that a tree is hit by lightning this step.
        </li>
      </ul>
      <p>The transition rules:</p>
      <ol>
        <li>
          A <strong>burning</strong> cell becomes <strong>empty</strong>.
        </li>
        <li>
          A <strong>tree</strong> cell starts <strong>burning</strong> if any neighbor is
          burning, or with probability <TeX tex="f" /> from lightning.
        </li>
        <li>
          An <strong>empty</strong> cell becomes a <strong>tree</strong> with probability{' '}
          <TeX tex="p" />.
        </li>
      </ol>
      <h3>Self-organized criticality</h3>
      <p>
        The system never settles. It hovers near a critical density at which fires of every
        size occur. The probability that a fire burns <TeX tex="N" /> trees follows a power law:
      </p>
      <TeX block tex="P(N) \\propto N^{-\\tau}" />
      <p>
        with <TeX tex="\\tau \\approx 1.15" /> in 2D. There is no characteristic fire size — a
        small ember might burn ten trees, or it might level a quarter of the forest. The system
        spontaneously tunes itself to the critical state without any external dial. This is the
        same phenomenon Per Bak proposed for earthquake magnitudes, sandpile avalanches, and
        many other natural cascade events.
      </p>
      <h3>Try</h3>
      <ul>
        <li>
          High <TeX tex="p" />, very low <TeX tex="f" /> — dense forest with rare, devastating
          mega-fires.
        </li>
        <li>
          Lower <TeX tex="p" />, higher <TeX tex="f" /> — sparse, frequent small fires.
        </li>
        <li>
          The interesting regime keeps <TeX tex="f \\ll p \\ll 1" /> with both small.
        </li>
      </ul>
    </>
  )
}
