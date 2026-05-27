import katex from 'katex'

interface Props {
  tex: string
  block?: boolean
}

export function TeX({ tex, block = false }: Props) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: block,
  })
  if (block) {
    return <div className="equation" dangerouslySetInnerHTML={{ __html: html }} />
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
