import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Otto Rössler designed his attractor in 1976 as the simplest possible 3D continuous
        system that could exhibit chaos — one quadratic nonlinearity, three coupled equations:
      </p>
      <TeX
        block
        tex={`\\begin{aligned}
\\dot x &= -y - z \\\\
\\dot y &= x + a\\,y \\\\
\\dot z &= b + z(x - c)
\\end{aligned}`}
      />
      <p>
        Lorenz had two nonlinear terms; Rössler showed one was enough. The classical parameters{' '}
        <TeX tex="(a, b, c) = (0.2, 0.2, 5.7)" /> produce a single chaotic spiral that lives
        mostly in the plane <TeX tex="z \\approx 0" />. Once in a while, when <TeX tex="x" />{' '}
        gets large enough, the <TeX tex="z" /> equation goes runaway and the orbit jumps
        vertically — only to be pulled back into the spiral.
      </p>
      <h3>Topology vs. Lorenz</h3>
      <p>
        The Lorenz attractor has two "wings" symmetric across an axis (a butterfly). The Rössler
        attractor is asymmetric: one band-like spiral with sporadic vertical excursions. The
        cross-section (a Poincaré map) of the Rössler attractor is roughly 1D — exactly
        matching the structure of the logistic map at chaos. This was one of the first concrete
        demonstrations that high-dimensional chaos can hide essentially 1D dynamics.
      </p>
      <h3>Try</h3>
      <ul>
        <li>
          Increase <TeX tex="c" /> → the orbit stays low for longer, more frequent jumps.
        </li>
        <li>
          Set <TeX tex="a = 0.1" />, <TeX tex="c = 14" /> → period-3 cycles instead of chaos.
        </li>
        <li>
          Set <TeX tex="a = 0.4" /> → wider spiral, less chaotic.
        </li>
      </ul>
    </>
  )
}
