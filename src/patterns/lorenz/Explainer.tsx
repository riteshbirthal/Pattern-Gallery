import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Edward Lorenz derived this 3-equation system in 1963 as a wildly simplified model of
        atmospheric convection. It is the system that gave us the term <em>butterfly effect</em>.
      </p>
      <TeX block tex="\dot x = \sigma\,(y - x)" />
      <TeX block tex="\dot y = x\,(\rho - z) - y" />
      <TeX block tex="\dot z = x\,y - \beta\,z" />
      <p>
        At the canonical parameters <TeX tex="\sigma = 10,\ \rho = 28,\ \beta = 8/3" /> the system
        is chaotic: trajectories never repeat, never settle, yet stay forever on a "strange
        attractor" of fractional dimension ≈ 2.06.
      </p>
      <p>
        We integrate with classical RK4 and project (x, z) to screen, with a small offset by y.
        Multiple particles starting near each other drift apart visibly within a few seconds —
        sensitive dependence on initial conditions in real time.
      </p>
      <p>
        Increase <TeX tex="\rho" /> beyond ~24.7 to enter the chaotic regime; below that you'll
        see fixed points or simple orbits.
      </p>
    </>
  )
}
