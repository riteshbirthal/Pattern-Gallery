import { Link, useParams } from 'react-router-dom'
import { getPattern } from '../patterns/registry'
import { PatternViewer } from '../components/PatternViewer'

export function PatternRoute() {
  const { id } = useParams()
  const pattern = id ? getPattern(id) : undefined

  if (!pattern) {
    return (
      <main className="not-found">
        <h1>Pattern not found</h1>
        <Link to="/">← Back to gallery</Link>
      </main>
    )
  }

  return (
    <div className="pattern-route">
      <nav className="topbar">
        <Link to="/">← Gallery</Link>
        <span className="topbar-category">{pattern.category}</span>
      </nav>
      <PatternViewer pattern={pattern} />
    </div>
  )
}
