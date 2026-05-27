import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Given a set of sites <TeX tex="\{p_1, \ldots, p_n\}" /> in the plane, the Voronoi cell
        of <TeX tex="p_i" /> is the set of points closer to <TeX tex="p_i" /> than to any other
        site:
      </p>
      <TeX block tex="V(p_i) = \{\,x : \|x - p_i\| \leq \|x - p_j\| \text{ for all } j\,\}" />
      <p>
        The choice of norm reshapes the cells dramatically. Euclidean distance gives the familiar
        polygons; Manhattan (taxicab) distance produces axis-aligned cells with diagonal walls;
        Chebyshev gives squares.
      </p>
      <p>
        We render with a brute-force per-pixel nearest-site lookup at half resolution — fine for
        a small number of sites and good enough to animate them in real time. For thousands of
        sites you'd reach for Fortune's sweepline algorithm.
      </p>
      <p>
        Voronoi diagrams appear everywhere in nature: dragonfly wings, soap foam, giraffe coat
        patterns, and cracked mud all approximate this partition.
      </p>
    </>
  )
}
