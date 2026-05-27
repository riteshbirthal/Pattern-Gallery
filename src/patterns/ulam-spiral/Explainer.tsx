import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        In 1963, Stanisław Ulam was sitting bored in a long talk and doodled the natural numbers
        in a square spiral starting from 1 at the centre. When he circled the primes he noticed
        — to his surprise — that they fell preferentially along diagonal lines. The Ulam spiral
        is one of the few examples in mathematics where a literal doodle exposed structure that
        no one had described before.
      </p>
      <h3>Construction</h3>
      <p>
        Lay the integers <TeX tex="1, 2, 3, \\ldots" /> on a square grid by spiralling outward.
        At each cell, ask whether the number written there is prime; if so, color the cell.
      </p>
      <h3>Why diagonals?</h3>
      <p>
        Diagonals of the spiral correspond to integer values of certain quadratic polynomials.
        Numbers along one such diagonal satisfy
      </p>
      <TeX block tex="f(n) = 4n^2 + bn + c" />
      <p>
        for fixed integers <TeX tex="b, c" />. Some quadratics are unusually rich in primes —
        Euler's famous polynomial <TeX tex="n^2 + n + 41" /> produces primes for{' '}
        <TeX tex="n = 0, 1, \\ldots, 39" /> consecutively, and shows up as a long bright diagonal
        on the spiral. The bigger question — whether any quadratic <TeX tex="an^2 + bn + c" /> with
        appropriate constants gives infinitely many primes — is wide open (Bunyakovsky conjecture).
      </p>
      <h3>Variants</h3>
      <ul>
        <li>
          <strong>Twin primes</strong>: highlight primes <TeX tex="p" /> where{' '}
          <TeX tex="p \\pm 2" /> is also prime. The twin prime conjecture (still unsolved)
          predicts infinitely many.
        </li>
        <li>
          <strong>Sophie Germain primes</strong>: <TeX tex="p" /> with <TeX tex="2p + 1" /> also
          prime. Important in cryptography and Fermat's last theorem.
        </li>
        <li>
          <strong>mod 6 coloring</strong>: every prime <TeX tex="p > 3" /> satisfies{' '}
          <TeX tex="p \\equiv \\pm 1 \\pmod{6}" />. Color the two residue classes differently to
          see the parity structure of the primes laid bare.
        </li>
      </ul>
    </>
  )
}
