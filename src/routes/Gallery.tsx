import { Link } from 'react-router-dom'
import { patterns, patternsByCategory } from '../patterns/registry'
import { PatternThumbnail } from '../components/PatternThumbnail'
import { HeroBackground } from '../components/HeroBackground'

export function Gallery() {
  const categories = patternsByCategory()
  return (
    <main className="gallery">
      <section className="hero">
        <HeroBackground />
        <div className="hero-inner">
          <span className="eyebrow">{patterns.length} interactive pattern generators</span>
          <h1 className="hero-title">
            The mathematics of <em>visual order</em>.
          </h1>
          <p className="hero-sub">
            A hand-built catalog of algorithmic patterns. Each is a different mechanism — cellular
            automata, reaction-diffusion, fractal iteration, noise, chaos. Every one ships with
            live parameters, the math that drives it, and a real-time canvas you can play with.
          </p>
          <div className="hero-tags">
            {categories.map((c) => (
              <a key={c.category} href={`#cat-${slug(c.category)}`} className="tag">
                {c.category}
                <span className="tag-count">{c.items.length}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat.category} id={`cat-${slug(cat.category)}`} className="category">
          <header className="category-header">
            <h2>{cat.category}</h2>
            <span className="category-count">{cat.items.length} patterns</span>
          </header>
          <ul className="grid">
            {cat.items.map((p) => (
              <li key={p.id}>
                <Link to={`/pattern/${p.id}`} className="card">
                  <div className="card-thumb">
                    <PatternThumbnail pattern={p} />
                    <span className="card-overlay">Open →</span>
                  </div>
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p>{p.blurb}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="gallery-footer">
        <div className="footer-inner">
          <p className="footer-lede">
            <em>Simple rules.</em> <em>Strange beauty.</em> <em>No two runs alike.</em>
          </p>
          <p>
            {patterns.length} machines for making patterns, sorted into {categories.length} ways of
            seeing. A snowflake decides where to grow. A reaction eats itself into stripes. A lone
            ant draws a highway out of chaos. The same handful of tricks — iterate, diffuse, repel,
            recurse — keeps inventing the universe in different costumes.
          </p>
          <p className="footer-credits">
            Open a card. Drag a slider. Watch the rule disappear into the result.
          </p>
        </div>
      </footer>
    </main>
  )
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
