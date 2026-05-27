import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Yoji Aizawa proposed this attractor in the late 1980s as a model of chaotic flow that
        produces a particularly photogenic geometric structure: a hollow torus-like vortex with
        a central column, looking somewhat like a smoke ring drifting upward.
      </p>
      <h3>System</h3>
      <TeX
        block
        tex="\\begin{aligned} \\dot{x} &= (z - b)x - dy \\\\ \\dot{y} &= dx + (z - b)y \\\\ \\dot{z} &= c + az - \\tfrac{z^3}{3} - (x^2 + y^2)(1 + ez) + fzx^3 \\end{aligned}"
      />
      <p>
        Six parameters with the canonical chaotic values{' '}
        <TeX tex="a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1" />.
      </p>
      <h3>Geometry</h3>
      <p>
        The first two equations are a 2D rotation in (x, y) modulated by{' '}
        <TeX tex="(z - b)" />: when <TeX tex="z > b" /> the orbit spirals outward; when{' '}
        <TeX tex="z < b" /> it spirals inward. The third equation has the stiff cubic term{' '}
        <TeX tex="-z^3/3" /> that bounds <TeX tex="z" /> and the radial coupling{' '}
        <TeX tex="-(x^2 + y^2)(1 + ez)" /> that pulls the orbit back in when it strays. The net
        effect is a stable bounded vortex with chaotic trajectories.
      </p>
      <h3>The "tube and vortex"</h3>
      <p>
        At the canonical parameters the attractor consists of a thin straight tube along the z
        axis surrounded by a wider helical sheet. Trajectories alternate unpredictably between
        the two — making short close passes along the tube before being flung back out into the
        helix. The transition between regimes is where the chaos lives.
      </p>
      <h3>Sensitivity</h3>
      <p>
        The Aizawa system is more parameter-sensitive than Lorenz: small changes to{' '}
        <TeX tex="b" /> or <TeX tex="d" /> can collapse the attractor onto a periodic orbit.
        Try sliding <TeX tex="b" /> from 0.65 to 0.78 — you'll watch the chaotic regime narrow,
        widen, and gain new structure.
      </p>
    </>
  )
}
