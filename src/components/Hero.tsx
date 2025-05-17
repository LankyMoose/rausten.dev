type HeroProps = {
  sup?: JSX.Children
  heading?: JSX.Children
  sub?: JSX.Children
}

export function Hero({ sup, heading, sub }: HeroProps) {
  return (
    <div id="hero">
      <div className="section-content flex flex-col">
        <small className="text-sm text-spicy">{sup}</small>
        <h1 className="mb-2.5">{heading}</h1>
        <p className="text-muted">{sub}</p>
      </div>
    </div>
  )
}
