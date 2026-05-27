import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Steven Worley introduced cellular noise in his 1996 SIGGRAPH paper "A Cellular Texture
        Basis Function." He scattered random "feature points" through space and asked, at each
        evaluation location, what is the distance to the <TeX tex="n" />-th nearest feature
        point? These distances{' '}
        <TeX tex="F_1, F_2, F_3, \\ldots" /> become channels for procedural texture
        synthesis.
      </p>
      <h3>Definition</h3>
      <p>
        Given feature points <TeX tex="\\{p_i\\}" /> in the plane, define
      </p>
      <TeX block tex="F_n(\\mathbf{x}) = \\text{the } n\\text{-th smallest of } \\{|\\mathbf{x} - p_i|\\}" />
      <h3>Visual recipes</h3>
      <ul>
        <li>
          <strong>Voronoi cells</strong>: color each pixel by the index of the nearest
          point. The cells are convex polygons; their edges are perpendicular bisectors of
          adjacent points (Voronoi diagram).
        </li>
        <li>
          <strong>F1</strong>: distance to nearest point. Looks like rounded blobs growing
          from each site — useful as a base for stone, dimpled leather, organic skin.
        </li>
        <li>
          <strong>F2 − F1</strong>: zero on Voronoi edges, peaks near cell centers. The dual
          of the above — produces a network of bright ridges (cracked-mud aesthetic).
        </li>
        <li>
          <strong>Voronoi cells with edges</strong>: nearest-color blended with{' '}
          <TeX tex="F_2 - F_1" /> attenuation, giving Voronoi regions with smooth dark borders.
          The look used in many cell-shaded aliens.
        </li>
      </ul>
      <h3>Why it shows up everywhere</h3>
      <p>
        Worley noise is the second most common procedural noise after Perlin noise. Pixar's{' '}
        <em>The Incredibles</em> used it for skin pore detail; <em>Avatar</em>'s biome
        textures use it for the network of veins on Pandora plants; water-caustics shaders use
        it as the base channel; and clouds in modern AAA engines stack F1 of differently-scaled
        site sets to produce realistic non-tiling cumulus.
      </p>
    </>
  )
}
