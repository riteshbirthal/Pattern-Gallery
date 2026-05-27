import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Arne Dehli Halvorsen proposed this 3D continuous-flow attractor in the early 1990s as a
        clean test case for chaos: it has a striking <strong>cyclic symmetry</strong> under
        permutation of the three coordinates, which forces the attractor to wind around all
        three axes equally.
      </p>
      <h3>System</h3>
      <TeX
        block
        tex="\\begin{aligned} \\dot{x} &= -ax - 4y - 4z - y^2 \\\\ \\dot{y} &= -ay - 4z - 4x - z^2 \\\\ \\dot{z} &= -az - 4x - 4y - x^2 \\end{aligned}"
      />
      <p>
        Each equation is structurally identical to the others, related by a cyclic shift{' '}
        <TeX tex="(x, y, z) \\to (y, z, x)" />. So if one trajectory wraps around an axis, the
        attractor must wrap around the other two as well.
      </p>
      <h3>Standard parameter</h3>
      <p>
        At <TeX tex="a = 1.4" /> the system is chaotic with a symmetric attractor whose three
        lobes look like Lorenz butterflies braided along the body diagonal{' '}
        <TeX tex="x = y = z" />. Decrease <TeX tex="a" /> below ~1.2 and the attractor
        un-knots; increase past ~1.9 and the trajectory diverges.
      </p>
      <h3>Lyapunov spectrum</h3>
      <p>
        The largest Lyapunov exponent at <TeX tex="a = 1.4" /> is approximately +0.78, and the
        Kaplan-Yorke (Lyapunov) dimension is about 2.0 — typical of low-dimensional chaotic
        attractors that are "sheets in 3D."
      </p>
      <h3>Why study symmetric attractors?</h3>
      <p>
        Most famous attractors (Lorenz, Rössler, Chen) have no special symmetry. Symmetric
        chaotic systems are useful in physics for modeling 3-mode resonances, certain Faraday
        instabilities, and synchronized oscillators where the physical setup forbids a
        preferred axis.
      </p>
    </>
  )
}
