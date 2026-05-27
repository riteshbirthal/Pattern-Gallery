import type { Pattern } from '../types/pattern'
import { reiterSnowflake } from './reiter-snowflake'
import { grayScott } from './gray-scott'
import { flowField } from './flow-field'
import { conwayLife } from './conway-life'
import { wolframCA } from './wolfram-ca'
import { mandelbrot } from './mandelbrot'
import { julia } from './julia'
import { voronoi } from './voronoi'
import { chaosGame } from './chaos-game'
import { barnsleyFern } from './barnsley-fern'
import { lSystem } from './l-system'
import { phyllotaxis } from './phyllotaxis'
import { lorenz } from './lorenz'
import { dla } from './dla'
import { truchet } from './truchet'
import { clifford } from './clifford'
import { deJong } from './de-jong'
import { newton } from './newton'
import { burningShip } from './burning-ship'
import { langtonAnt } from './langton-ant'
import { lenia } from './lenia'
import { penrose } from './penrose'
import { lissajous } from './lissajous'
import { rose } from './rose'
import { boids } from './boids'
import { chladni } from './chladni'
import { logistic } from './logistic'
import { cyclicCA } from './cyclic-ca'
import { brianBrain } from './brian-brain'
import { forestFire } from './forest-fire'
import { rossler } from './rossler'
import { henon } from './henon'
import { apollonian } from './apollonian'
import { diamondSquare } from './diamond-square'
import { maze } from './maze'
import { buddhabrot } from './buddhabrot'
import { hilbert } from './hilbert'
import { perlinField } from './perlin-field'
import { bzReaction } from './bz-reaction'
import { wireworld } from './wireworld'
import { sandpile } from './sandpile'
import { schelling } from './schelling'
import { ising } from './ising'
import { margolus } from './margolus'
import { sierpinskiCarpet } from './sierpinski-carpet'
import { sierpinskiTriangle } from './sierpinski-triangle'
import { kochSnowflake } from './koch-snowflake'
import { pythagorasTree } from './pythagoras-tree'
import { heighwayDragon } from './heighway-dragon'
import { levyC } from './levy-c'
import { halvorsen } from './halvorsen'
import { aizawa } from './aizawa'
import { thomasAttractor } from './thomas-attractor'
import { tinkerbell } from './tinkerbell'
import { gumowskiMira } from './gumowski-mira'
import { ulamSpiral } from './ulam-spiral'
import { pascalMod } from './pascal-mod'
import { recaman } from './recaman'
import { collatz } from './collatz'
import { sternBrocot } from './stern-brocot'
import { doublePendulum } from './double-pendulum'
import { magneticPendulum } from './magnetic-pendulum'
import { nbody } from './nbody'
import { kuramoto } from './kuramoto'
import { fitzhughNagumo } from './fitzhugh-nagumo'
import { wfc } from './wfc'
import { worley } from './worley'
import { quasicrystal } from './quasicrystal'
import { domainColoring } from './domain-coloring'

export const patterns: Pattern[] = [
  reiterSnowflake,
  dla,
  conwayLife,
  wolframCA,
  langtonAnt,
  lenia,
  cyclicCA,
  brianBrain,
  forestFire,
  wireworld,
  sandpile,
  schelling,
  ising,
  margolus,
  bzReaction,
  grayScott,
  fitzhughNagumo,
  mandelbrot,
  julia,
  newton,
  burningShip,
  buddhabrot,
  chaosGame,
  barnsleyFern,
  apollonian,
  sierpinskiCarpet,
  sierpinskiTriangle,
  kochSnowflake,
  pythagorasTree,
  heighwayDragon,
  lSystem,
  phyllotaxis,
  boids,
  maze,
  voronoi,
  truchet,
  penrose,
  hilbert,
  lissajous,
  rose,
  chladni,
  flowField,
  perlinField,
  diamondSquare,
  lorenz,
  rossler,
  henon,
  logistic,
  clifford,
  deJong,
  halvorsen,
  aizawa,
  thomasAttractor,
  tinkerbell,
  gumowskiMira,
  levyC,
  ulamSpiral,
  pascalMod,
  recaman,
  collatz,
  sternBrocot,
  doublePendulum,
  magneticPendulum,
  nbody,
  kuramoto,
  wfc,
  worley,
  quasicrystal,
  domainColoring,
]

export function getPattern(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id)
}

export function buildDefaultParams(pattern: Pattern) {
  const params: Record<string, number | string | boolean> = {}
  for (const p of pattern.params) {
    params[p.name] = p.default
  }
  return params
}

export function patternsByCategory(): { category: string; items: Pattern[] }[] {
  const map = new Map<string, Pattern[]>()
  for (const p of patterns) {
    const list = map.get(p.category) ?? []
    list.push(p)
    map.set(p.category, list)
  }
  // Curated category order.
  const order = [
    'Crystalline',
    'Cellular Automata',
    'Reaction-Diffusion',
    'Fractals',
    'Growth',
    'Geometry',
    'Noise / Flow',
    'Chaos',
    'Number Theory',
    'Physics',
    'Procedural',
    'Complex Analysis',
  ]
  return order
    .filter((cat) => map.has(cat))
    .map((category) => ({ category, items: map.get(category)! }))
}
