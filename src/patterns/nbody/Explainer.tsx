import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Newton (1687) wrote down the gravitational equations for two bodies and solved them
        completely: orbits are conic sections. He hoped — and so did Laplace and Lagrange — to
        do the same for three. They failed. In 1889, Henri Poincaré proved that the three-body
        problem admits no algebraic conserved quantities beyond the obvious ones, and his
        analysis is widely regarded as the birth of modern dynamical systems theory.
      </p>
      <h3>Equations</h3>
      <TeX
        block
        tex="\\ddot{\\mathbf{r}}_i = G \\sum_{j \\neq i} m_j \\frac{\\mathbf{r}_j - \\mathbf{r}_i}{|\\mathbf{r}_j - \\mathbf{r}_i|^3}"
      />
      <p>
        We integrate using leapfrog/symplectic Euler with a small softening{' '}
        <TeX tex="\\varepsilon^2" /> in the denominator to avoid the numerical singularity at
        close encounters. This is what every cosmological simulation does — Aarseth's NBODY
        codes, GADGET, the Springel TNG simulations.
      </p>
      <h3>Choreographies</h3>
      <p>
        The three-body figure-eight, discovered numerically by Cristopher Moore (1993) and
        proven rigorously by Alain Chenciner and Richard Montgomery in 2000, is a periodic
        solution where three equal masses chase each other along a single figure-eight curve.
        It is one of a (now infinite) zoo of <em>choreographies</em> — orbits where all bodies
        traverse the same path with equal time spacing.
      </p>
      <p>
        The original initial conditions are
      </p>
      <TeX block tex="\\mathbf{r}_1 = (0.9700, -0.2431), \\quad \\mathbf{v}_1 = (0.4662, 0.4324)" />
      <p>
        with body 2 the reflection of body 1 and body 3 at the origin moving at twice the
        opposite velocity.
      </p>
      <h3>Why two-body is special</h3>
      <p>
        For <TeX tex="N = 2" /> the centre of mass moves uniformly, leaving a one-body
        problem in the relative coordinate. The 6 degrees of freedom drop to 2 effective ones,
        and the conservation of energy + angular momentum closes the system. For{' '}
        <TeX tex="N \\geq 3" /> there are not enough conserved quantities; chaos enters; and
        most random initial conditions lead to one body being ejected at hyperbolic speed.
      </p>
    </>
  )
}
