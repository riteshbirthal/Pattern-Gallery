import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        A holomorphic function <TeX tex="f : \\mathbb{C} \\to \\mathbb{C}" /> is a 4D object —
        two real coordinates in, two out. We cannot easily plot it as a graph. Frank Farris
        (1998) popularised <strong>domain coloring</strong> as a way around this: at every
        point <TeX tex="z" /> in the input plane, color the pixel using both the argument and
        magnitude of <TeX tex="f(z)" />. The 2D image then encodes the entire function.
      </p>
      <h3>The convention</h3>
      <p>
        At pixel <TeX tex="z" />, compute <TeX tex="w = f(z)" /> and use:
      </p>
      <ul>
        <li>
          <strong>Hue</strong> = <TeX tex="\\arg(w)" /> — color cycles around the rainbow as
          you go around <TeX tex="w = 0" />.
        </li>
        <li>
          <strong>Lightness</strong> = repeating function of <TeX tex="\\log|w|" /> — gives
          contour bands where <TeX tex="|w|" /> doubles.
        </li>
      </ul>
      <h3>Reading the picture</h3>
      <ul>
        <li>
          A <strong>zero</strong> of order <TeX tex="k" /> shows up as a point where the hues
          cycle <TeX tex="k" /> times as you walk a tiny loop around it (a +k winding).
        </li>
        <li>
          A <strong>pole</strong> of order <TeX tex="k" /> winds the hues backwards{' '}
          <TeX tex="k" /> times (a −k winding) — and is surrounded by tightly packed brightness
          bands as <TeX tex="|w| \\to \\infty" />.
        </li>
        <li>
          <strong>Saddles</strong> are where the brightness bands cross transversely and the
          hue field has a node.
        </li>
      </ul>
      <h3>Try this</h3>
      <ul>
        <li>
          <TeX tex="f(z) = z^3 - 1" /> over <TeX tex="(z^2 + z + 1)" />: three zeros at the cube
          roots of unity — and the denominator's roots are exactly the non-real cube roots of 1,
          so they cancel except for one residual zero at <TeX tex="z = 1" />. Picture has one
          big +1 winding, no poles.
        </li>
        <li>
          <TeX tex="f(z) = \\Gamma(z)" />: the gamma function. Note the simple poles at every
          non-positive integer (winding −1, ringed brightness) and the pretty exponential
          spread of magnitude in the right half-plane.
        </li>
        <li>
          <TeX tex="f(z) = \\sin(z)" />: zeros at every <TeX tex="n\\pi" /> on the real axis;
          hyperbolic growth in the imaginary direction visible as banded magnitude levels.
        </li>
      </ul>
    </>
  )
}
