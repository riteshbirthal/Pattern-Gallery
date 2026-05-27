import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        In 1975 Yoshiki Kuramoto wrote down a deceptively simple model for coupled phase
        oscillators. It became one of the most studied equations in nonlinear science because
        it captures the essence of synchronization phenomena that recur everywhere — fireflies
        flashing in unison, neurons in the suprachiasmatic nucleus, applause in a concert hall,
        Josephson junctions in arrays, the locked rotation of moons.
      </p>
      <h3>Equations</h3>
      <TeX
        block
        tex="\\dot\\theta_i = \\omega_i + \\frac{K}{N} \\sum_{j=1}^{N} \\sin(\\theta_j - \\theta_i)"
      />
      <p>
        Each oscillator <TeX tex="i" /> has its own natural frequency <TeX tex="\\omega_i" />{' '}
        drawn from a distribution (we use uniform <TeX tex="[-\\sigma, \\sigma]" />). The
        coupling tries to drag each phase toward the mean of the others.
      </p>
      <h3>Order parameter</h3>
      <p>
        Define the complex order parameter
      </p>
      <TeX block tex="r e^{i\\psi} = \\frac{1}{N}\\sum_{j=1}^{N} e^{i\\theta_j}" />
      <p>
        with <TeX tex="r \\in [0,1]" /> measuring synchronization. The mean-field equation
        becomes
      </p>
      <TeX block tex="\\dot\\theta_i = \\omega_i + K r \\sin(\\psi - \\theta_i)" />
      <p>
        — each oscillator is pulled toward the mean phase <TeX tex="\\psi" /> with strength{' '}
        <TeX tex="Kr" />.
      </p>
      <h3>Phase transition</h3>
      <p>
        For <TeX tex="K < K_c" />, oscillators run independently and <TeX tex="r \\to 0" />. At{' '}
        <TeX tex="K = K_c" /> a continuous transition occurs and a coherent cluster nucleates;
        for <TeX tex="K > K_c" />, <TeX tex="r" /> grows toward 1. The critical coupling for a
        unimodal symmetric distribution <TeX tex="g(\\omega)" /> is
      </p>
      <TeX block tex="K_c = \\frac{2}{\\pi g(0)}" />
      <p>
        For uniform <TeX tex="\\omega \\in [-\\sigma, \\sigma]" />, <TeX tex="g(0) = 1/(2\\sigma)" />,
        so <TeX tex="K_c = 4\\sigma/\\pi" />. With the default spread of 1, that is roughly{' '}
        <TeX tex="K_c \\approx 1.27" />. Slide the slider across this value and watch the order
        parameter on the right snap from noise to a saturated value.
      </p>
    </>
  )
}
