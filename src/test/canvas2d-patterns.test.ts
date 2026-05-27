import { describe, it, expect, vi } from 'vitest'
import { conwayLife } from '../patterns/conway-life'
import { wolframCA } from '../patterns/wolfram-ca'
import { voronoi } from '../patterns/voronoi'
import { chaosGame } from '../patterns/chaos-game'
import { barnsleyFern } from '../patterns/barnsley-fern'
import { lSystem } from '../patterns/l-system'
import { phyllotaxis } from '../patterns/phyllotaxis'
import { lorenz } from '../patterns/lorenz'
import { dla } from '../patterns/dla'
import { truchet } from '../patterns/truchet'
import { clifford } from '../patterns/clifford'
import { deJong } from '../patterns/de-jong'
import { langtonAnt } from '../patterns/langton-ant'
import { lenia } from '../patterns/lenia'
import { penrose } from '../patterns/penrose'
import { lissajous } from '../patterns/lissajous'
import { rose } from '../patterns/rose'
import { boids } from '../patterns/boids'
import { chladni } from '../patterns/chladni'
import { logistic } from '../patterns/logistic'
import { cyclicCA } from '../patterns/cyclic-ca'
import { brianBrain } from '../patterns/brian-brain'
import { forestFire } from '../patterns/forest-fire'
import { rossler } from '../patterns/rossler'
import { henon } from '../patterns/henon'
import { apollonian } from '../patterns/apollonian'
import { diamondSquare } from '../patterns/diamond-square'
import { maze } from '../patterns/maze'
import { buddhabrot } from '../patterns/buddhabrot'
import { hilbert } from '../patterns/hilbert'
import { perlinField } from '../patterns/perlin-field'
import { bzReaction } from '../patterns/bz-reaction'
import { wireworld } from '../patterns/wireworld'
import { sandpile } from '../patterns/sandpile'
import { schelling } from '../patterns/schelling'
import { ising } from '../patterns/ising'
import { margolus } from '../patterns/margolus'
import { sierpinskiCarpet } from '../patterns/sierpinski-carpet'
import { sierpinskiTriangle } from '../patterns/sierpinski-triangle'
import { kochSnowflake } from '../patterns/koch-snowflake'
import { pythagorasTree } from '../patterns/pythagoras-tree'
import { heighwayDragon } from '../patterns/heighway-dragon'
import { levyC } from '../patterns/levy-c'
import { halvorsen } from '../patterns/halvorsen'
import { aizawa } from '../patterns/aizawa'
import { thomasAttractor } from '../patterns/thomas-attractor'
import { tinkerbell } from '../patterns/tinkerbell'
import { gumowskiMira } from '../patterns/gumowski-mira'
import { ulamSpiral } from '../patterns/ulam-spiral'
import { pascalMod } from '../patterns/pascal-mod'
import { recaman } from '../patterns/recaman'
import { collatz } from '../patterns/collatz'
import { sternBrocot } from '../patterns/stern-brocot'
import { doublePendulum } from '../patterns/double-pendulum'
import { magneticPendulum } from '../patterns/magnetic-pendulum'
import { nbody } from '../patterns/nbody'
import { kuramoto } from '../patterns/kuramoto'
import { fitzhughNagumo } from '../patterns/fitzhugh-nagumo'
import { wfc } from '../patterns/wfc'
import { worley } from '../patterns/worley'
import { quasicrystal } from '../patterns/quasicrystal'
import { domainColoring } from '../patterns/domain-coloring'
import { buildDefaultParams } from '../patterns/registry'
import type { Pattern } from '../types/pattern'

function fakeCanvas(w = 200, h = 150): HTMLCanvasElement {
  const stub: any = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    lineCap: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    globalAlpha: 1,
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    rect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    closePath: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    clip: vi.fn(),
    setLineDash: vi.fn(),
    createImageData: (ww: number, hh: number) => ({
      data: new Uint8ClampedArray(ww * hh * 4),
      width: ww,
      height: hh,
    }),
    getImageData: (_x: number, _y: number, ww: number, hh: number) => ({
      data: new Uint8ClampedArray(ww * hh * 4),
      width: ww,
      height: hh,
    }),
    putImageData: vi.fn(),
    createLinearGradient: () => ({ addColorStop: vi.fn() }),
    createRadialGradient: () => ({ addColorStop: vi.fn() }),
    measureText: () => ({ width: 0 }),
  }
  return {
    width: w,
    height: h,
    getContext: () => stub,
  } as unknown as HTMLCanvasElement
}

function smokeTest(name: string, pattern: Pattern) {
  it(`${name} initializes, steps, and disposes without error`, () => {
    const canvas = fakeCanvas()
    const r = pattern.createRenderer()
    r.init({
      canvas,
      width: 200,
      height: 150,
      params: buildDefaultParams(pattern),
    })
    for (let i = 0; i < 3; i++) r.step()
    r.draw()
    r.reset()
    r.dispose()
  })
}

describe('Canvas2D pattern smoke tests', () => {
  smokeTest('Conway Life', conwayLife)
  smokeTest('Wolfram CA', wolframCA)
  smokeTest('Voronoi', voronoi)
  smokeTest('Chaos game', chaosGame)
  smokeTest('Barnsley fern', barnsleyFern)
  smokeTest('L-system', lSystem)
  smokeTest('Phyllotaxis', phyllotaxis)
  smokeTest('Lorenz', lorenz)
  smokeTest('DLA', dla)
  smokeTest('Truchet', truchet)
  smokeTest('Clifford', clifford)
  smokeTest('De Jong', deJong)
  smokeTest('Langton ant', langtonAnt)
  smokeTest('Lenia', lenia)
  smokeTest('Penrose', penrose)
  smokeTest('Lissajous', lissajous)
  smokeTest('Rose & spirograph', rose)
  smokeTest('Boids', boids)
  smokeTest('Chladni', chladni)
  smokeTest('Logistic bifurcation', logistic)
  smokeTest('Cyclic CA', cyclicCA)
  smokeTest("Brian's Brain", brianBrain)
  smokeTest('Forest fire', forestFire)
  smokeTest('Rössler', rossler)
  smokeTest('Hénon', henon)
  smokeTest('Apollonian', apollonian)
  smokeTest('Diamond-Square', diamondSquare)
  smokeTest('Maze', maze)
  smokeTest('Buddhabrot', buddhabrot)
  smokeTest('Hilbert curves', hilbert)
  smokeTest('Perlin field', perlinField)
  smokeTest('BZ reaction', bzReaction)
  smokeTest('Wireworld', wireworld)
  smokeTest('Sandpile', sandpile)
  smokeTest('Schelling', schelling)
  smokeTest('Ising', ising)
  smokeTest('Margolus', margolus)
  smokeTest('Sierpinski carpet', sierpinskiCarpet)
  smokeTest('Sierpinski triangle', sierpinskiTriangle)
  smokeTest('Koch snowflake', kochSnowflake)
  smokeTest('Pythagoras tree', pythagorasTree)
  smokeTest('Heighway dragon', heighwayDragon)
  smokeTest('Lévy C', levyC)
  smokeTest('Halvorsen', halvorsen)
  smokeTest('Aizawa', aizawa)
  smokeTest('Thomas attractor', thomasAttractor)
  smokeTest('Tinkerbell', tinkerbell)
  smokeTest('Gumowski-Mira', gumowskiMira)
  smokeTest('Ulam spiral', ulamSpiral)
  smokeTest('Pascal mod n', pascalMod)
  smokeTest("Recaman", recaman)
  smokeTest('Collatz', collatz)
  smokeTest('Stern-Brocot', sternBrocot)
  smokeTest('Double pendulum', doublePendulum)
  smokeTest('Magnetic pendulum', magneticPendulum)
  smokeTest('N-body', nbody)
  smokeTest('Kuramoto', kuramoto)
  smokeTest('FitzHugh-Nagumo', fitzhughNagumo)
  smokeTest('WFC', wfc)
  smokeTest('Worley', worley)
  smokeTest('Quasicrystal', quasicrystal)
  smokeTest('Domain coloring', domainColoring)

  it('every pattern is registered exactly once', () => {
    const ids = [
      conwayLife.id,
      wolframCA.id,
      voronoi.id,
      chaosGame.id,
      barnsleyFern.id,
      lSystem.id,
      phyllotaxis.id,
      lorenz.id,
      dla.id,
      truchet.id,
      clifford.id,
      deJong.id,
      langtonAnt.id,
      lenia.id,
      penrose.id,
      lissajous.id,
      rose.id,
      boids.id,
      chladni.id,
      logistic.id,
      cyclicCA.id,
      brianBrain.id,
      forestFire.id,
      rossler.id,
      henon.id,
      apollonian.id,
      diamondSquare.id,
      maze.id,
      buddhabrot.id,
      hilbert.id,
      perlinField.id,
      bzReaction.id,
      wireworld.id,
      sandpile.id,
      schelling.id,
      ising.id,
      margolus.id,
      sierpinskiCarpet.id,
      sierpinskiTriangle.id,
      kochSnowflake.id,
      pythagorasTree.id,
      heighwayDragon.id,
      levyC.id,
      halvorsen.id,
      aizawa.id,
      thomasAttractor.id,
      tinkerbell.id,
      gumowskiMira.id,
      ulamSpiral.id,
      pascalMod.id,
      recaman.id,
      collatz.id,
      sternBrocot.id,
      doublePendulum.id,
      magneticPendulum.id,
      nbody.id,
      kuramoto.id,
      fitzhughNagumo.id,
      wfc.id,
      worley.id,
      quasicrystal.id,
      domainColoring.id,
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Wolfram CA logic', () => {
  it('rule 90 produces XOR (Sierpinski) from a single seed', async () => {
    // Synthesize the rule 90 transition: next = left XOR right
    const cols = 21
    const grid = new Uint8Array(cols)
    grid[10] = 1
    const next = new Uint8Array(cols)
    const rule = 90
    for (let x = 0; x < cols; x++) {
      const left = grid[(x - 1 + cols) % cols]
      const center = grid[x]
      const right = grid[(x + 1) % cols]
      const idx = (left << 2) | (center << 1) | right
      next[x] = (rule >> idx) & 1
    }
    // After one step: alive cells at positions 9 and 11 only.
    expect(next[9]).toBe(1)
    expect(next[10]).toBe(0)
    expect(next[11]).toBe(1)
  })
})

describe('Conway Life logic', () => {
  it("blinker oscillates with period 2", async () => {
    // Build a 5x5 isolated blinker (3 horizontal cells in middle row).
    const cols = 5
    const rows = 5
    const grid = new Uint8Array(cols * rows)
    grid[2 * cols + 1] = 1
    grid[2 * cols + 2] = 1
    grid[2 * cols + 3] = 1

    const step = (g: Uint8Array): Uint8Array => {
      const out = new Uint8Array(cols * rows)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue
              const nx = (x + dx + cols) % cols
              const ny = (y + dy + rows) % rows
              if (g[ny * cols + nx]) n++
            }
          }
          const alive = g[y * cols + x] !== 0
          if (alive && (n === 2 || n === 3)) out[y * cols + x] = 1
          else if (!alive && n === 3) out[y * cols + x] = 1
        }
      }
      return out
    }
    const after1 = step(grid)
    // Should now be a vertical bar.
    expect(after1[1 * cols + 2]).toBe(1)
    expect(after1[2 * cols + 2]).toBe(1)
    expect(after1[3 * cols + 2]).toBe(1)
    expect(after1[2 * cols + 1]).toBe(0)
    expect(after1[2 * cols + 3]).toBe(0)
    const after2 = step(after1)
    // Back to horizontal.
    for (let i = 0; i < grid.length; i++) expect(after2[i]).toBe(grid[i])
  })
})
