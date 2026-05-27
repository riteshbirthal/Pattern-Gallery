import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Pascal's triangle of binomial coefficients <TeX tex="\\binom{n}{k}" /> hides a beautiful
        secret when read modulo a prime. <strong>Lucas's theorem</strong> (1878) tells us that
        the residues are determined by the base-<TeX tex="p" /> digits of <TeX tex="n" /> and{' '}
        <TeX tex="k" />:
      </p>
      <TeX block tex="\\binom{n}{k} \\equiv \\prod_{i} \\binom{n_i}{k_i} \\pmod{p}" />
      <p>
        where <TeX tex="n_i, k_i" /> are the base-<TeX tex="p" /> digits. The product is zero as
        soon as any <TeX tex="k_i > n_i" />. This forces a self-similar geometry on the colored
        triangle — for <TeX tex="p = 2" /> it is exactly the Sierpinski gasket; for{' '}
        <TeX tex="p = 3" /> a triangular tiling with three colors and the same recursive holes;
        and so on.
      </p>
      <h3>Why prime moduli are special</h3>
      <p>
        Composite moduli break Lucas's theorem and the picture loses its clean self-similarity —
        the structure becomes a superposition of the prime-power patterns coming from each
        prime factor of <TeX tex="m" />. Try modulus 6: you'll see the gasket of 2 and the
        triangle of 3 interfering with each other.
      </p>
      <h3>Connection to fractal dimension</h3>
      <p>
        For prime <TeX tex="p" />, the fraction of nonzero entries in the first{' '}
        <TeX tex="p^k" /> rows is <TeX tex="\\binom{p+1}{2}^k / p^{2k} = ((p+1)/(2p))^k" />. So
        the box-counting dimension of the colored figure is
      </p>
      <TeX block tex="d_p = \\frac{\\log\\binom{p+1}{2}}{\\log p}" />
      <p>
        which gives ≈1.585 for <TeX tex="p = 2" />, ≈1.631 for <TeX tex="p = 3" />, ≈1.682 for{' '}
        <TeX tex="p = 5" />, growing slowly toward 2.
      </p>
    </>
  )
}
