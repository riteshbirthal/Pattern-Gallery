import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        Each cell is alive or dead. At every tick the next state depends only on the cell and its
        eight Moore neighbours (B3/S23):
      </p>
      <ul>
        <li>
          A live cell with <TeX tex="2" /> or <TeX tex="3" /> live neighbours survives.
        </li>
        <li>
          A dead cell with exactly <TeX tex="3" /> live neighbours is born.
        </li>
        <li>All other cells die or stay dead.</li>
      </ul>
      <p>
        From these rules emerge oscillators (pulsar, blinker), spaceships (glider, LWSS), and
        guns (Gosper) that spawn streams of gliders. Conway's Life is Turing-complete: any
        computable function can be encoded as a sufficiently large initial configuration.
      </p>
      <p>
        Newly-born cells are highlighted brighter for one tick so you can see the wavefront of
        change.
      </p>
    </>
  )
}
