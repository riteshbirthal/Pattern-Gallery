import { TeX } from '../../components/Math'

export default function Explainer() {
  return (
    <>
      <p>
        The diamond-square algorithm (Fournier, Fussell, Carpenter — 1982 SIGGRAPH paper "Computer
        Rendering of Stochastic Models") was the first widely-used technique for generating
        fractal terrain. It powered the planet generation in the 1985 simulator <em>Rescue on
        Fractalus!</em> and many of the first CGI mountains in film and games.
      </p>
      <h3>Algorithm</h3>
      <p>
        Start with a square heightmap of side <TeX tex="2^n + 1" />. Seed the four corners with
        random heights. Then alternate two steps until the grid is full:
      </p>
      <ol>
        <li>
          <strong>Diamond step:</strong> for every square, set its <em>center</em> to the
          average of the four corners plus a random perturbation.
        </li>
        <li>
          <strong>Square step:</strong> for every diamond formed by those centers and the
          original corners, set its <em>center</em> to the average of its four corners plus
          (smaller) noise.
        </li>
      </ol>
      <p>
        After each pair of steps, halve the noise amplitude — multiplied by{' '}
        <TeX tex="2^{-H}" /> where <TeX tex="H" /> is the Hurst exponent. Smaller{' '}
        <TeX tex="H" /> = noise persists, terrain looks jagged. Larger <TeX tex="H" /> = noise
        damps quickly, terrain looks smooth.
      </p>
      <h3>Fractal dimension</h3>
      <p>
        The result approximates a 2D fractional Brownian surface. Its Hausdorff dimension is{' '}
        <TeX tex="3 - H" />. Real Earth-like terrain has <TeX tex="H \\approx 0.7" />, giving
        dimension ~2.3 — slightly more than a smooth surface, less than a fully space-filling
        crumpled paper. This is exactly the regime where most viewers say "that looks natural."
      </p>
      <h3>Limitations</h3>
      <p>
        Diamond-square has a known visible artifact: the rectangular grid creates faint axis-aligned
        creases at large scales, especially for low <TeX tex="H" />. Modern terrain pipelines
        replace it with multi-octave Perlin/Simplex noise — but diamond-square is still the
        cleanest pedagogical introduction to fractal terrain.
      </p>
    </>
  )
}
