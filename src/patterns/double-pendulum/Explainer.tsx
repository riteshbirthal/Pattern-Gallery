import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The double pendulum — two simple pendulums joined end-to-end — is the canonical
        textbook example of mechanical chaos. With only two degrees of freedom and three
        numerical parameters, it is one of the simplest physical systems whose equations admit
        no closed-form solution and whose behaviour is provably sensitive to initial
        conditions.
      </p>
      <h3>Equations of motion</h3>
      <p>
        Using Lagrangian mechanics with masses <TeX tex="m_1, m_2" /> at the ends of rigid rods of
        length <TeX tex="\\ell_1, \\ell_2" /> under gravity <TeX tex="g" />, the equations of
        motion in angles <TeX tex="\\theta_1, \\theta_2" /> are coupled, nonlinear, and not
        pretty. They look schematically like
      </p>
      <TeX
        block
        tex="\\ddot\\theta_1 = \\frac{N_1(\\theta_1, \\theta_2, \\dot\\theta_1, \\dot\\theta_2)}{D(\\theta_1, \\theta_2)}"
      />
      <p>
        with <TeX tex="\\ddot\\theta_2" /> following an analogous form. The coupling through the
        common pivot is what generates the chaos.
      </p>
      <h3>Sensitive dependence</h3>
      <p>
        Release two double pendulums with the upper-arm angle differing by{' '}
        <TeX tex="10^{-3}" /> radians and watch what happens. Within roughly 10–15 seconds of
        physical time the orbits visibly diverge; within 30 seconds they are essentially
        independent. The largest Lyapunov exponent at moderate energies is around 7.5 s
        <sup>-1</sup> — so any error in initial conditions doubles every 100 ms.
      </p>
      <h3>What you see</h3>
      <p>
        We draw the trace of the second bob. With many initial conditions varied by a tiny{' '}
        <em>spread</em>, the bouquet of trails spreads from a coherent line into a flower of
        chaotic petals — a direct visual demonstration of Lyapunov divergence.
      </p>
    </>
  )
}
