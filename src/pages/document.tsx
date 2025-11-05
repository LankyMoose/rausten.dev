import { Head, Body } from "kiru/router"
import "../styles.css"

export default function Document() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Rob Austen" />
        <meta property="og:site_name" content="Rob Austen" />
        <meta property="og:title" content="Rob Austen" />
        <meta
          property="og:description"
          content="The personal website of Rob Austen"
        />
        <meta property="og:url" content="https://rausten.dev" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://rausten.dev/opengraph.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rob Austen" />
        <meta
          name="twitter:description"
          content="The personal website of Rob Austen"
        />
        <meta
          name="twitter:image"
          content="https://rausten.dev/opengraph.png"
        />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        <Head.Outlet />
      </head>
      <Body.Outlet />
    </html>
  )
}
