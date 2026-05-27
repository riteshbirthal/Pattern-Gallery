import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Stern-Brocot tree, discovered independently by Moritz Stern (1858, a number
        theorist) and Achille Brocot (1861, a clockmaker who needed gear ratios), is a binary
        tree that contains <strong>every</strong> positive rational number exactly once and in
        lowest terms — no other data structure with this property is so elegant.
      </p>
      <h3>Construction</h3>
      <p>
        Begin with two boundary fractions <TeX tex="0/1" /> and <TeX tex="1/0" />. The root is
        their <em>mediant</em>:
      </p>
      <TeX block tex="\\text{mediant}\\left(\\frac{a}{b}, \\frac{c}{d}\\right) = \\frac{a + c}{b + d}" />
      <p>
        — that is, <TeX tex="1/1" />. Every node has two children: the mediant of itself with its
        left ancestor (left child) and the mediant of itself with its right ancestor (right
        child). The tree first reads 1/1, then 1/2 and 2/1, then 1/3, 2/3, 3/2, 3/1, and so on.
      </p>
      <h3>Why this is remarkable</h3>
      <ul>
        <li>
          Every fraction appears exactly once, automatically in lowest terms — you never need to
          reduce.
        </li>
        <li>
          The path from the root to any rational <TeX tex="p/q" /> encodes its{' '}
          <strong>continued fraction expansion</strong>. Lefts and rights count partial quotients.
        </li>
        <li>
          In-order traversal lists rationals in numerical order — the tree is a search tree for
          the rationals.
        </li>
      </ul>
      <h3>Farey sequence and Ford circles</h3>
      <p>
        The Farey sequence <TeX tex="F_n" /> is the ordered list of fractions in <TeX tex="[0,1]" />{' '}
        with denominator at most <TeX tex="n" />. Lester Ford's 1938 visualization places at each
        rational <TeX tex="p/q" /> a circle of radius <TeX tex="1/(2q^2)" /> tangent to the
        number line. Two Ford circles are either disjoint or externally tangent — and they are
        tangent precisely when the two fractions are neighbours in some <TeX tex="F_n" />, i.e.{' '}
        when <TeX tex="|ad - bc| = 1" />. The Ford-circle picture is a tessellation of the upper
        half plane that is dual to the Stern-Brocot tree.
      </p>
    </>
  )
}
