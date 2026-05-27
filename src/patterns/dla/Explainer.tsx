export default function Explainer() {
  return (
    <>
      <p>
        Witten and Sander introduced DLA in 1981. The recipe is mortifyingly simple:
      </p>
      <ol>
        <li>Place a seed pixel.</li>
        <li>Release a particle from far away that random-walks until it touches the cluster.</li>
        <li>It sticks. Repeat.</li>
      </ol>
      <p>
        The result is a fractal cluster with dimension ≈ 1.71 (in 2D). Each new particle preferentially
        sticks to the tips of the cluster — the interior is "screened" because random walks
        rarely diffuse all the way in. This screening produces the characteristic dendritic
        branching seen in lichen growth, electrochemical deposition, viscous fingering, and lung
        bronchi.
      </p>
      <p>
        Lowering <strong>stickiness</strong> below 1 lets particles bounce off and find more
        interior positions before sticking — yielding denser, less branched clusters.
      </p>
      <p>
        Try the "Bottom line" seed: walkers fall down and stick, producing a forest of
        ice-fern–like fronds.
      </p>
    </>
  )
}
