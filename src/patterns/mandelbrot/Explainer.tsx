import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        For each point <TeX tex="c \in \mathbb{C}" /> we iterate the map{' '}
        <TeX tex="z_{n+1} = z_n^2 + c" /> starting from <TeX tex="z_0 = 0" />.
      </p>
      <ul>
        <li>
          If <TeX tex="|z_n|" /> stays bounded forever, <TeX tex="c" /> is in the Mandelbrot set
          (drawn black).
        </li>
        <li>
          Otherwise we record how quickly it escaped and color the pixel by that escape rate.
        </li>
      </ul>
      <p>
        We use the standard "smooth iteration count" formula{' '}
        <TeX tex="\nu = n - \log_2 \log_2 |z|^2" /> to avoid banding, and bail out at a maximum
        iteration count for points that haven't escaped (those are likely inside the set).
      </p>
      <p>
        The shader runs entirely on the GPU. Try centering at{' '}
        <TeX tex="(-0.745, 0.113)" /> and cranking zoom + iterations to see the seahorse valley.
      </p>
    </>
  )
}
