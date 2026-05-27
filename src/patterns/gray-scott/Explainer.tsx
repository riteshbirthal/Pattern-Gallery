import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Two virtual chemicals <TeX tex="U" /> and <TeX tex="V" /> coexist on a 2D surface. They
        diffuse independently and react via the autocatalytic step{' '}
        <TeX tex="U + 2V \to 3V" />, while <TeX tex="U" /> is replenished and <TeX tex="V" /> is
        removed at constant rates.
      </p>

      <TeX
        block
        tex="\frac{\partial U}{\partial t} = D_u\, \nabla^2 U - U V^2 + F\,(1 - U)"
      />
      <TeX
        block
        tex="\frac{\partial V}{\partial t} = D_v\, \nabla^2 V + U V^2 - (F + k)\,V"
      />

      <p>
        The <TeX tex="(F, k)" /> plane is famously rich. Tiny moves through it switch between
        spots, stripes, dividing-cell mitosis, and labyrinths. The simulator runs on the GPU using
        a ping-pong pair of float textures and a 9-point Laplacian stencil.
      </p>

      <h3>Parameters</h3>
      <ul>
        <li>
          <TeX tex="F" /> — feed rate of <TeX tex="U" />.
        </li>
        <li>
          <TeX tex="k" /> — kill rate of <TeX tex="V" />.
        </li>
        <li>
          <TeX tex="D_u, D_v" /> — diffusion coefficients. The ratio matters far more than the
          absolute values.
        </li>
      </ul>

      <h3>Recipes worth trying</h3>
      <ul>
        <li>
          <strong>Spots:</strong> <TeX tex="F = 0.030,\ k = 0.062" />
        </li>
        <li>
          <strong>Mitosis:</strong> <TeX tex="F = 0.037,\ k = 0.060" />
        </li>
        <li>
          <strong>Labyrinth:</strong> <TeX tex="F = 0.039,\ k = 0.058" />
        </li>
        <li>
          <strong>Coral:</strong> <TeX tex="F = 0.062,\ k = 0.062" />
        </li>
      </ul>
    </>
  )
}
