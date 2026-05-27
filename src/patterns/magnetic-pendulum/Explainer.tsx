import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Suspend a pendulum with an iron bob over a horizontal plane on which several magnets
        are arranged in a circle. Pull the bob aside and let go: friction will eventually bring
        it to rest over one of the magnets. The question — first studied numerically in the
        1980s — is which one?
      </p>
      <h3>Equations</h3>
      <p>
        Treating the bob as a damped point mass restored toward the centre and attracted by
        each magnet at distance{' '}
        <TeX tex="d_i" /> via an inverse-square law (regularised by the pendulum's hover
        height <TeX tex="h" />):
      </p>
      <TeX
        block
        tex="\\ddot{\\mathbf{r}} = -\\tfrac{1}{2}\\mathbf{r} - k\\,\\dot{\\mathbf{r}} - \\sum_i \\frac{\\mathbf{r} - \\mathbf{r}_i}{(|\\mathbf{r} - \\mathbf{r}_i|^2 + h^2)^{3/2}}"
      />
      <h3>The fractal basin</h3>
      <p>
        For each starting position, simulate until the bob settles, and color the pixel by which
        magnet it ended up at. With three magnets you get the famous result: the basin
        boundaries are not curves at all but a <strong>Wada fractal</strong> — every point on
        the boundary of one basin is also on the boundary of <em>both</em> the other basins.
        This is the topological characterisation Yoneyama Kunizo proved for the Lakes of Wada
        in 1917, here showing up in a desktop physics demo.
      </p>
      <h3>What this teaches</h3>
      <p>
        Predicting the long-term outcome of a deterministic system can be{' '}
        <em>practically</em> impossible: arbitrarily close starting points end at different
        magnets, so any uncertainty in the initial conditions destroys predictability even
        though the dynamics is fully deterministic and there is no chaos in the strict positive-
        Lyapunov sense — the trajectories all settle. Sensitivity to initial conditions does
        not require chaos.
      </p>
    </>
  )
}
