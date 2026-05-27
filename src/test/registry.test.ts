import { describe, it, expect } from 'vitest'
import { patterns, getPattern, buildDefaultParams } from '../patterns/registry'

describe('pattern registry', () => {
  it('has at least three patterns', () => {
    expect(patterns.length).toBeGreaterThanOrEqual(3)
  })

  it('every pattern id is unique', () => {
    const ids = patterns.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every pattern has required fields', () => {
    for (const p of patterns) {
      expect(p.id).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.category).toBeTruthy()
      expect(p.blurb).toBeTruthy()
      expect(typeof p.createRenderer).toBe('function')
      expect(typeof p.explainer).toBe('function')
    }
  })

  it('every parameter name is unique within a pattern', () => {
    for (const p of patterns) {
      const names = p.params.map((s) => s.name)
      expect(new Set(names).size).toBe(names.length)
    }
  })

  it('numeric default lies within [min, max]', () => {
    for (const p of patterns) {
      for (const s of p.params) {
        if (s.type === 'number') {
          expect(s.default).toBeGreaterThanOrEqual(s.min)
          expect(s.default).toBeLessThanOrEqual(s.max)
          expect(s.step).toBeGreaterThan(0)
        }
      }
    }
  })

  it('select default is one of the listed options', () => {
    for (const p of patterns) {
      for (const s of p.params) {
        if (s.type === 'select') {
          const values = s.options.map((o) => o.value)
          expect(values).toContain(s.default)
        }
      }
    }
  })

  it('getPattern returns the correct pattern by id', () => {
    for (const p of patterns) {
      expect(getPattern(p.id)).toBe(p)
    }
    expect(getPattern('does-not-exist')).toBeUndefined()
  })

  it('buildDefaultParams produces a value for every param', () => {
    for (const p of patterns) {
      const params = buildDefaultParams(p)
      for (const s of p.params) {
        expect(params).toHaveProperty(s.name)
        expect(params[s.name]).toBe(s.default)
      }
    }
  })
})
