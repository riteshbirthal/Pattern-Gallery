import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Collatz conjecture is the simplest open problem in mathematics that almost anyone can
        state. Lothar Collatz proposed it in 1937. Define
      </p>
      <TeX
        block
        tex="T(n) = \\begin{cases} n/2 & n \\text{ even} \\\\ 3n+1 & n \\text{ odd} \\end{cases}"
      />
      <p>
        and iterate. The conjecture: for every positive integer <TeX tex="n" />, the sequence{' '}
        <TeX tex="n, T(n), T(T(n)), \\ldots" /> eventually reaches 1.
      </p>
      <h3>Why is it hard?</h3>
      <p>
        On the surface the orbit looks random: numbers shoot up dramatically before crashing
        back down (27 reaches a peak of 9232 before terminating after 111 steps). The conjecture
        has been verified by computer for all <TeX tex="n < 2.95 \\times 10^{20}" />, but no proof
        is known. Paul Erdős famously said:
      </p>
      <blockquote>
        "Mathematics may not be ready for such problems."
      </blockquote>
      <p>
        Terence Tao proved in 2019 that "almost all" Collatz orbits attain almost bounded values
        — a striking partial result that does not, however, settle the conjecture itself.
      </p>
      <h3>Three views</h3>
      <ul>
        <li>
          <strong>Orbit traces</strong>: each starting seed plotted as a log-scale curve over
          time, showing the explosive peaks before collapse.
        </li>
        <li>
          <strong>Stopping times</strong>: scatter of <TeX tex="n" /> against the number of
          iterations needed to reach 1. The cloud has a fractal-looking sub-structure.
        </li>
        <li>
          <strong>Recoil tree</strong>: replay each orbit as a line that turns left on even
          steps and right on odd, joined at 1 — Edmund Harriss's organic visualisation that
          looks startlingly like seaweed.
        </li>
      </ul>
    </>
  )
}
