type HeroProps = {
  sup?: JSX.Children
  heading?: JSX.Children
  sub?: JSX.Children
}

export function Hero({ sup, heading, sub }: HeroProps) {
  return (
    <div className="flex flex-col min-h-48 justify-center">
      <span
        className="text-lg text-primary-500"
        style="view-transition-name:hero-span"
      >
        {sup}
      </span>
      <h1
        className="mb-2.5 text-5xl sm:text-6xl font-bold"
        style="view-transition-name:hero-h1"
      >
        {heading}
      </h1>
      <p
        className="text-lg text-neutral-300"
        style="view-transition-name:hero-sub"
      >
        {sub}
      </p>
    </div>
  )
}
