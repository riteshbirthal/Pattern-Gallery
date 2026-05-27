import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        A 1D row of binary cells evolves one row at a time. Each new cell is determined by its
        three predecessors — left, self, right — via an 8-entry lookup table. There are{' '}
        <TeX tex="2^8 = 256" /> possible tables, so each rule fits in a byte: the "Wolfram code".
      </p>
      <p>
        For example, <strong>Rule 30</strong> in binary is <code>00011110</code>. Reading the
        bits from MSB → LSB labels the neighbourhood patterns 111, 110, …, 000 with the next-cell
        value. The result is statistically random and was once used as a PRNG by Mathematica.
      </p>
      <p>
        Notable rules:
      </p>
      <ul>
        <li>
          <strong>Rule 30</strong> — chaotic, asymmetric.
        </li>
        <li>
          <strong>Rule 90</strong> — XOR rule. From a single seed: a perfect Sierpinski triangle.
        </li>
        <li>
          <strong>Rule 110</strong> — proven Turing-complete in 2004 by Matthew Cook.
        </li>
        <li>
          <strong>Rule 184</strong> — models traffic flow.
        </li>
      </ul>
      <p>Time flows downward; once the canvas fills, the simulation restarts.</p>
    </>
  )
}
