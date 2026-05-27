import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Belousov-Zhabotinsky (BZ) reaction is a real-world chemical mixture that, instead of
        reaching equilibrium and stopping, oscillates indefinitely between colored states. In a
        thin dish it produces gorgeous self-organized spiral waves. Boris Belousov discovered it
        in 1951 — and was rejected for publication twice because reviewers insisted it violated
        the second law of thermodynamics. (It doesn't: the reaction is far from equilibrium and
        consumes free energy.)
      </p>
      <h3>The hodgepodge machine</h3>
      <p>
        Gerhardt and Schuster (1989) gave a CA caricature of BZ called the "hodgepodge machine."
        Each cell holds an integer state <TeX tex="s \\in \\{0, 1, \\ldots, N\\}" />:
      </p>
      <ul>
        <li>
          <TeX tex="s = 0" /> — <strong>healthy</strong>
        </li>
        <li>
          <TeX tex="0 < s < N" /> — <strong>infected</strong> (sicker as s grows)
        </li>
        <li>
          <TeX tex="s = N" /> — <strong>fully ill</strong> (about to recover)
        </li>
      </ul>
      <p>The transition rule, with neighborhood = Moore (8 cells), is:</p>
      <TeX
        block
        tex="s' = \\begin{cases} \\lfloor A/k_1 \\rfloor + \\lfloor B/k_2 \\rfloor & s = 0 \\\\ \\lfloor S / (A + B + 1) \\rfloor + g & 0 < s < N \\\\ 0 & s = N \\end{cases}"
      />
      <p>
        where <TeX tex="A" /> = number of infected neighbors,{' '}
        <TeX tex="B" /> = number of fully ill neighbors, and <TeX tex="S" /> = sum of states
        (including self). A healthy cell catches the disease from neighbors. An infected cell
        averages with neighbors and ages by <TeX tex="g" />. A fully ill cell instantly
        recovers.
      </p>
      <h3>Excitable media</h3>
      <p>
        This is the prototypical example of an <strong>excitable medium</strong>: each cell can
        sit dormant until tipped by neighbors, fire through a refractory cycle, then return to
        rest. Real BZ reactions, cardiac tissue, slime mold, and forest fires all share this
        structure. Excitable media support traveling waves and, at parameter sweet spots, robust
        spiral waves whose tips wander chaotically.
      </p>
      <h3>What you should see</h3>
      <p>
        From random initial conditions the field organizes within a few hundred steps. Spiral
        cores appear at topological defects of the wave field. Try increasing <TeX tex="g" />:
        the wavefronts thicken, spirals get rarer. Decreasing <TeX tex="N" /> coarsens the
        excitation cycle.
      </p>
      <h3>Connection to Gray-Scott</h3>
      <p>
        The Gray-Scott reaction-diffusion pattern in this gallery is the continuous-PDE cousin
        of this CA. Both belong to the family of "excitable / oscillatory reaction-diffusion
        systems" that exhibit Turing-type pattern formation.
      </p>
    </>
  )
}
