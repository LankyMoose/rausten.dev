type HeroProps = {
  small?: JSX.Children
  big?: JSX.Children
  description?: JSX.Children
}

export function Hero({ small, big, description }: HeroProps) {
  return (
    <div id="hero">
      <div className="section-content flex flex-col gap-2">
        <h1>
          <small className="text-sm text-spicy">{small}</small>
          <big>{big}</big>
        </h1>
        <p className="text-muted">{description}</p>
      </div>
    </div>
  )
}
