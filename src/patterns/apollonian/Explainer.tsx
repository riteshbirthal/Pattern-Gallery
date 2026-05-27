import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Start with three mutually tangent circles inside a fourth that contains them. The four
        gaps that remain are <strong>curvilinear triangles</strong>. Each gap has a unique
        inscribed circle that is tangent to all three of its bounding circles. Add it. Now you
        have eight new gaps. Recurse.
      </p>
      <h3>Descartes' circle theorem</h3>
      <p>
        For four mutually tangent circles with signed curvatures{' '}
        <TeX tex="k_1, k_2, k_3, k_4" /> (curvature = 1/radius, negative if the circle encloses
        the others):
      </p>
      <TeX block tex="(k_1 + k_2 + k_3 + k_4)^2 = 2(k_1^2 + k_2^2 + k_3^2 + k_4^2)" />
      <p>
        René Descartes wrote this in a 1643 letter to Princess Elisabeth of Bohemia. Solve the
        quadratic for <TeX tex="k_4" /> given the other three:
      </p>
      <TeX block tex="k_4 = k_1 + k_2 + k_3 \\pm 2\\sqrt{k_1 k_2 + k_2 k_3 + k_1 k_3}" />
      <p>
        The two roots are the curvatures of the two circles tangent to the original three. If
        you start from a triple, one root is the original fourth circle; the other gives you the
        new one to inscribe in the gap.
      </p>
      <h3>Integer gaskets</h3>
      <p>
        If the four starting curvatures are integers, then <em>every</em> curvature in the
        infinite gasket is an integer. The set of curvatures that appears is highly structured:
        for example, with seeds <TeX tex="(-1, 2, 2, 3)" /> the gasket contains every positive
        integer that is{' '}
        <TeX tex="\\equiv 2, 3, 6, 11, 14, 15, 18, 23 \\pmod{24}" />. Settling those allowed
        residues took until the 21st century to fully prove.
      </p>
      <h3>Fractal dimension</h3>
      <p>
        The complement of the gasket (the points covered by no circle) is a fractal Cantor-like
        set with Hausdorff dimension <TeX tex="\\approx 1.3057" />. It has measure zero, but
        plenty of "fractal substance" between the circles.
      </p>
    </>
  )
}
