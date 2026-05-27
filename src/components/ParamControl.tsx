import type { ParamSchema, ParamValues } from '../types/pattern'

interface Props {
  schema: ParamSchema
  value: ParamValues[string]
  onChange: (value: ParamValues[string]) => void
}

export function ParamControl({ schema, value, onChange }: Props) {
  if (schema.type === 'number') {
    const n = value as number
    return (
      <label className="param">
        <div className="param-header">
          <span className="param-label">{schema.label}</span>
          <span className="param-value">{formatNumber(n, schema.step)}</span>
        </div>
        <input
          type="range"
          min={schema.min}
          max={schema.max}
          step={schema.step}
          value={n}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        {schema.description && <p className="param-desc">{schema.description}</p>}
      </label>
    )
  }

  if (schema.type === 'select') {
    return (
      <label className="param">
        <div className="param-header">
          <span className="param-label">{schema.label}</span>
        </div>
        <select value={value as string} onChange={(e) => onChange(e.target.value)}>
          {schema.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {schema.description && <p className="param-desc">{schema.description}</p>}
      </label>
    )
  }

  return (
    <label className="param param-checkbox">
      <input
        type="checkbox"
        checked={value as boolean}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="param-label">{schema.label}</span>
      {schema.description && <p className="param-desc">{schema.description}</p>}
    </label>
  )
}

function formatNumber(n: number, step: number): string {
  if (step >= 1) return n.toFixed(0)
  if (step >= 0.01) return n.toFixed(3)
  return n.toFixed(4)
}
