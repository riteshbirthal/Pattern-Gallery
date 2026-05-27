import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Hodgkin and Huxley's 1952 four-variable model of the squid giant axon won them a Nobel
        prize but is fiendish to analyse. In 1961, Richard FitzHugh stripped it to two variables
        — fast voltage <TeX tex="u" /> and slow recovery <TeX tex="v" /> — and Jin-Ichi Nagumo
        independently realised the same equations as a tunnel-diode circuit a year later. The
        FitzHugh-Nagumo model is the canonical "excitable medium": at rest, but kicked above a
        threshold it fires a stereotyped pulse and refractory recovery.
      </p>
      <h3>The PDE</h3>
      <TeX
        block
        tex="\\begin{aligned} \\partial_t u &= D \\nabla^2 u + u - u^3/3 - v \\\\ \\partial_t v &= \\varepsilon (u + a - b v) \\end{aligned}"
      />
      <p>
        With <TeX tex="\\varepsilon" /> small the <TeX tex="v" /> dynamics is much slower than{' '}
        <TeX tex="u" /> — this separation of timescales is what makes the medium excitable
        rather than oscillatory.
      </p>
      <h3>Spiral waves and cardiac arrhythmia</h3>
      <p>
        The excitable medium FitzHugh-Nagumo is a textbook model for cardiac tissue. A
        propagating wavefront curls into a spiral if it encounters a refractory zone — and
        spiral waves on the heart muscle are the textbook explanation for ventricular
        tachycardia. Further breakup of a spiral into multiple smaller spirals is the model for
        ventricular <em>fibrillation</em>, which is fatal within minutes.
      </p>
      <p>
        The seminal work here is Arthur Winfree's 1972 paper showing that rotating waves in
        excitable media are a <em>generic</em> phenomenon: any 2D excitable medium will support
        them under some perturbation. He coined the term "scroll wave" for the 3D analogue
        living in a heart-sized chunk of muscle.
      </p>
      <h3>Try this</h3>
      <p>
        Start from the <em>spiral seed</em> and watch a spiral form within ~50 frames. Drop{' '}
        <TeX tex="\\varepsilon" /> very low to slow the recovery — the spiral arms thicken and
        slow. Push <TeX tex="\\varepsilon" /> high and the medium becomes purely oscillatory:
        homogeneous flashing rather than spirals.
      </p>
    </>
  )
}
