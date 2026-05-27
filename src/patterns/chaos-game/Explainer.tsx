import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The chaos game is the simplest possible IFS (iterated function system). Place{' '}
        <TeX tex="n" /> vertices around a circle. Start anywhere. At each step:
      </p>
      <ol>
        <li>Pick a vertex at random.</li>
        <li>Move halfway from your current position toward that vertex.</li>
        <li>Plot a dot at your new position.</li>
        <li>Repeat.</li>
      </ol>
      <p>
        With <TeX tex="n = 3" /> vertices and ratio <TeX tex="r = 1/2" />, this produces the{' '}
        <strong>Sierpinski triangle</strong>. Other vertex counts only show structure with a
        carefully chosen ratio or restriction:
      </p>
      <ul>
        <li>
          <strong>4 vertices:</strong> uniform random fill — no fractal!
        </li>
        <li>
          <strong>4 vertices, "no-repeat":</strong> a structured pattern emerges.
        </li>
        <li>
          <strong>5 vertices, ratio 0.382 (1/φ²):</strong> a Sierpinski pentagon.
        </li>
      </ul>
      <p>
        Restrictions matter because they break the ergodicity that smears non-Sierpinski cases
        into a uniform blob. This is your laboratory for exploring how a tiny bit of memory
        creates enormous structural change.
      </p>
    </>
  )
}
