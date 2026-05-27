import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Reiter's 2005 model treats each cell on a hexagonal grid as carrying a single scalar{' '}
        <TeX tex="s" /> — interpreted as ice when <TeX tex="s \geq 1" /> and as diffusing water
        vapor otherwise. The grid is updated in three substeps per tick:
      </p>

      <p>
        <strong>1. Receptivity.</strong> A cell is <em>receptive</em> if it (or any of its six
        hex neighbours) is frozen. Each cell splits its content:
      </p>
      <TeX block tex="u_i = (1 - r_i) s_i, \qquad v_i = r_i s_i" />
      <p>
        where <TeX tex="r_i \in \{0,1\}" /> is the receptivity flag.
      </p>

      <p>
        <strong>2. Diffusion.</strong> Only the non-receptive field <TeX tex="u" /> diffuses, with
        rate <TeX tex="\alpha" />:
      </p>
      <TeX block tex="u'_i = u_i + \tfrac{\alpha}{2}\,(\langle u \rangle_{N(i)} - u_i)" />

      <p>
        <strong>3. Vapor input.</strong> Receptive cells gain a constant <TeX tex="\gamma" /> per
        step, then everything is recombined:
      </p>
      <TeX block tex="s'_i = u'_i + v_i + \gamma\, r_i" />

      <h3>Parameters</h3>
      <ul>
        <li>
          <TeX tex="\beta" /> — uniform initial vapor density. Lower values starve the crystal;
          higher values produce thicker plates.
        </li>
        <li>
          <TeX tex="\alpha" /> — diffusion rate. Controls how easily vapor flows toward the
          growing crystal.
        </li>
        <li>
          <TeX tex="\gamma" /> — extra vapor injected at the boundary. Acts like a
          supersaturation knob; tiny values yield delicate dendrites.
        </li>
      </ul>

      <p>
        <strong>Try:</strong> set <TeX tex="\beta = 0.4, \alpha = 1.0" /> for classic dendrites.
        Bump <TeX tex="\beta" /> to 0.6 for stellar plates. Add a touch of <TeX tex="\gamma" /> for
        sharper sidebranching.
      </p>
    </>
  )
}
