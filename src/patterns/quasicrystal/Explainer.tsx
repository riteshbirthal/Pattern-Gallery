import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Dan Shechtman startled the materials-science community in 1982 by reporting an
        aluminium-manganese alloy whose electron diffraction pattern showed five-fold
        rotational symmetry — supposedly impossible in a periodic crystal. Linus Pauling
        infamously dismissed Shechtman's work ("there are no quasicrystals, only quasi-
        scientists"), but the discovery was vindicated; Shechtman won the 2011 Nobel Prize in
        Chemistry, and quasicrystals are now an established phase of matter.
      </p>
      <h3>The simple stripe picture</h3>
      <p>
        A clean way to see <em>why</em> aperiodic order with N-fold symmetry is possible is to
        sum equally-spaced plane waves:
      </p>
      <TeX
        block
        tex="C(x, y) = \\frac{1}{N} \\sum_{i=0}^{N-1} \\cos\\!\\left(k(x \\cos\\theta_i + y \\sin\\theta_i) + \\varphi\\right), \\quad \\theta_i = \\frac{\\pi i}{N}"
      />
      <p>
        Each cosine contour is a stripe pattern in one direction. Their sum is symmetric under
        rotation by <TeX tex="\\pi/N" />, which would force the whole thing to be periodic only
        if <TeX tex="N \\in \\{1, 2, 3, 4, 6\\}" /> (the crystallographic restriction theorem).
        For <TeX tex="N = 5, 7, 8, \\ldots" /> the result has the symmetry but{' '}
        <em>cannot</em> be periodic — and indeed the stripes interfere into beautiful aperiodic
        tilings.
      </p>
      <h3>Connection to Penrose tiles</h3>
      <p>
        Take N = 5 and sample the brightness contours on a grid: thresholding produces an
        approximation to a Penrose tiling. The mathematical reason is that both the wave-
        interference and the tile-substitution constructions can be derived as projections of a
        higher-dimensional cubic lattice down into 2D — N-fold quasiperiodicity in 2D is the
        shadow of perfect periodicity in N dimensions.
      </p>
      <h3>Try this</h3>
      <p>
        Set N = 5 — pentagonal interference, rich starburst centres. N = 8 — gives dodecagonal
        symmetry, found in some real Mn-Si quasicrystals. Slide <em>phase</em> to animate the
        whole pattern through a continuous family — physically, this is what happens in time-
        dependent neutron scattering on a true quasicrystal.
      </p>
    </>
  )
}
