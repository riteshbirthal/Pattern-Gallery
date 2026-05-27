export default function Explainer() {
  return (
    <>
      <p>
        A "perfect maze" is a spanning tree of a grid graph: every cell is reachable from every
        other cell, with exactly one path between any two cells (no loops, no isolated rooms).
        This pattern shows three classic ways to grow such a tree, each with a distinctive
        signature.
      </p>
      <h3>Recursive backtracker (DFS)</h3>
      <p>
        Maintain a stack. From the top cell, pick a random unvisited neighbor and carve a
        passage to it; if there are no unvisited neighbors, pop. The signature is{' '}
        <strong>long, twisty corridors</strong> — the algorithm follows one branch deep before
        ever backing up. Bias towards rivers of solution.
      </p>
      <h3>Prim's algorithm</h3>
      <p>
        Maintain a frontier set of cells adjacent to the visited region. Each step, pick a
        uniformly random frontier cell and connect it to a random visited neighbor. The
        signature is <strong>short, branchy passages</strong> — the maze grows outward like a
        sponge with many short dead ends.
      </p>
      <h3>Wilson's algorithm</h3>
      <p>
        Pick a starting cell. Then repeatedly: choose any unvisited cell, take a uniformly
        random walk until you hit the visited set, and add the <em>loop-erased</em> path to the
        maze (any time the walk revisits its own trail, the loop is erased). David Wilson
        proved in 1996 that this yields a uniformly distributed random spanning tree — every
        possible perfect maze is generated with exactly equal probability. The other two
        algorithms have biases; Wilson's is unbiased at the cost of long random walks early on.
      </p>
      <h3>Why all three?</h3>
      <p>
        They all build spanning trees of the same graph, but the <em>distribution</em> over
        trees differs. Texture shows it: backtracker mazes feel snake-like, Prim's mazes feel
        crystalline, Wilson's mazes feel statistically "average." Try the same cell size with
        each algorithm and compare.
      </p>
    </>
  )
}
