import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Naive random noise (independent per pixel) looks like television static — too high
        frequency to feel "natural." Real-world textures (clouds, terrain, marble, fire) have
        smooth low-frequency variation with detail layered on top. <strong>Perlin noise</strong>
        {' '}is a 1985 invention by Ken Perlin specifically to manufacture this kind of randomness
        for the movie <em>Tron</em>. He won an Academy Award for Technical Achievement for it in
        1997.
      </p>
      <h3>Gradient noise</h3>
      <p>
        At every integer lattice point pick a random unit vector (the "gradient"). To evaluate
        noise at <TeX tex="(x, y)" />:
      </p>
      <ol>
        <li>Find the four corners of the lattice cell containing the point.</li>
        <li>
          For each corner, take the dot product of its gradient with the offset vector to{' '}
          <TeX tex="(x, y)" />.
        </li>
        <li>
          Smoothly interpolate the four dot products using the quintic{' '}
          <TeX tex="6t^5 - 15t^4 + 10t^3" /> (which has zero first and second derivatives at the
          endpoints, so the noise is <TeX tex="C^2" />-continuous).
        </li>
      </ol>
      <p>
        Each corner contributes zero at itself (the offset is the zero vector) and nonzero
        elsewhere — the gradient encodes the <em>slope</em> of the noise locally. The result is
        smooth, has zero mean, and has a controllable bandwidth.
      </p>
      <h3>Simplex noise</h3>
      <p>
        In 2001 Perlin replaced the cube lattice with a triangular (or in higher dimensions,
        simplex) lattice. Same idea but: fewer corners to evaluate per sample (<TeX tex="n+1" />{' '}
        instead of <TeX tex="2^n" />), no directional artifacts, and analytically defined
        derivatives. This implementation uses simplex noise.
      </p>
      <h3>Fractal Brownian motion</h3>
      <p>
        A single octave of noise has a single dominant scale. Real textures span many scales.
        Standard remedy: sum <TeX tex="N" /> octaves, each at higher frequency and lower
        amplitude:
      </p>
      <TeX
        block
        tex="\\text{fbm}(x) = \\sum_{i=0}^{N-1} p^i \\cdot \\text{noise}(\\ell^i x)"
      />
      <p>
        with <strong>persistence</strong> <TeX tex="p" /> (typically 0.5) and{' '}
        <strong>lacunarity</strong> <TeX tex="\\ell" /> (typically 2). Lower persistence = smoother;
        higher persistence = noisier ("crinklier"). The result is a fractal-like surface — its
        spectrum follows a power law, like real terrain, like real clouds, like turbulence.
      </p>
      <h3>Beyond visualization</h3>
      <p>
        This is one of the most-used algorithms in graphics history. Procedural terrain
        (Minecraft, No Man's Sky), wood/marble shaders, smoke and fire simulations, motion
        synthesis, infinite mipmaps — all built on top of this single technique.
      </p>
    </>
  )
}
