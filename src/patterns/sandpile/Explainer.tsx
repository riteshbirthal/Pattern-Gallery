import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The Bak-Tang-Wiesenfeld sandpile (1987) was introduced as the first explicit model of{' '}
        <strong>self-organized criticality</strong>: a physical system that, without any
        parameter tuning, naturally evolves to a state where avalanches occur on every length
        scale.
      </p>
      <h3>Rule</h3>
      <p>
        Each grid cell holds a non-negative integer "height." Drop a grain at a random cell. Any
        cell whose height reaches 4 <em>topples</em>: it loses 4 grains and gives one each to
        its four orthogonal neighbors. Toppling can chain — neighbors may now have 4+ grains and
        topple in turn — producing an avalanche. Grains that fall off the boundary leave the
        system.
      </p>
      <p>
        Repeat indefinitely. The pile organizes itself such that avalanche size{' '}
        <TeX tex="s" /> follows a power law{' '}
      </p>
      <TeX block tex="P(s) \propto s^{-\tau}" />
      <p>
        with no characteristic scale. There is no parameter you tune to get there — the system
        finds it on its own.
      </p>
      <h3>The Abelian property</h3>
      <p>
        The remarkable theorem (Dhar, 1990): if you drop grains at multiple locations, the final
        relaxed configuration is independent of the <em>order</em> in which you drop them, and
        independent of the order in which unstable cells are toppled. Hence "Abelian sandpile" —
        the pile carries an actual <em>group structure</em>, with the recurrent configurations
        forming an abelian group under pointwise addition (modulo toppling).
      </p>
      <h3>The fractal equilibrium</h3>
      <p>
        Drop millions of grains at a single point and let the pile relax. The result is a
        finite, beautifully self-similar fractal of nested patterns of heights 0, 1, 2, 3 — a
        unique stable equilibrium with measure-zero fractal scaling exponent ≈ 2.10. This is
        what the "Single huge stack" mode shows.
      </p>
      <h3>Why it matters</h3>
      <p>
        The sandpile inspired the broader theory of self-organized criticality, used to model
        earthquakes (Gutenberg-Richter law), neural avalanches in brain tissue, financial market
        crashes, biological extinction events, and 1/f noise in many physical systems.
      </p>
    </>
  )
}
