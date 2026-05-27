import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        A flow field samples a 3D simplex-noise field as a vector field over the canvas: at
        every pixel the noise value is reinterpreted as an angle, which gives a smoothly varying
        direction.
      </p>

      <TeX block tex="\theta(x, y, z) = 2\pi \cdot N(s\,x,\ s\,y,\ z)" />

      <p>
        Particles are dropped at random positions and integrated forward through this field —
        each step they look up the angle at their current location and move a fixed distance in
        that direction:
      </p>

      <TeX block tex="\mathbf{p}_{t+1} = \mathbf{p}_t + v \cdot (\cos\theta,\ \sin\theta)" />

      <p>
        We slowly advance the third noise dimension <TeX tex="z" /> over time so the field morphs
        organically rather than being static. The trails accumulate on the canvas with a low-alpha
        wash so each frame partially fades the prior one.
      </p>

      <h3>Parameters</h3>
      <ul>
        <li>
          <strong>noise scale</strong> (<TeX tex="s" />) — small values give huge, sweeping
          currents; large values give turbulence.
        </li>
        <li>
          <strong>particle speed</strong> (<TeX tex="v" />) — pixels per step.
        </li>
        <li>
          <strong>particle count</strong> — more walkers = denser image.
        </li>
        <li>
          <strong>trail fade</strong> — 0 keeps every brushstroke forever; raise it to favour the
          current frame.
        </li>
      </ul>

      <p>
        <strong>Try:</strong> a low scale (~2) with 3000 particles and zero fade for an inkwash
        look; or scale 8 + heavy fade for a swirling smoke effect.
      </p>
    </>
  )
}
