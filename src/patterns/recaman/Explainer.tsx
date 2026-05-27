import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Bernardo Recamán Santos defined a sequence in 1991 by a single rule: at step{' '}
        <TeX tex="n" />, subtract <TeX tex="n" /> from the previous term if the result is positive
        and not already in the sequence; otherwise add <TeX tex="n" />. Plotting each step as a
        semicircle alternating above and below a number line produces an instantly recognisable
        figure popularised by Numberphile and Edmund Harriss.
      </p>
      <h3>Definition</h3>
      <TeX
        block
        tex="a_n = \\begin{cases} a_{n-1} - n & \\text{if } a_{n-1} - n > 0 \\text{ and unused} \\\\ a_{n-1} + n & \\text{otherwise} \\end{cases}"
      />
      <p>
        with <TeX tex="a_0 = 0" />. The first values are 0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11,
        22, 10, 23, 9, 24, 8, 25, 43, 62, 42, 63, 41, ….
      </p>
      <h3>The big open question</h3>
      <p>
        <strong>Does Recamán's sequence eventually visit every non-negative integer?</strong>{' '}
        Despite computer searches reaching <TeX tex="10^{15}" /> terms, the integer 852,655 is
        the smallest known number not yet visited. No one has proven that it must eventually be
        reached — and no one has proven that any integer is permanently missed. It is one of the
        cleanest "obvious-looking but unsolved" problems in number theory.
      </p>
      <h3>Visualization</h3>
      <p>
        Each successive pair <TeX tex="(a_{n-1}, a_n)" /> draws a semicircle whose diameter is
        the distance between them; we alternate above and below the axis so that the trail stays
        legible. The result is a hauntingly organic figure that has been printed on T-shirts,
        adapted for music (every term mapped to a piano key), and occupies a corner of the
        Numberphile catalogue all to itself.
      </p>
    </>
  )
}
