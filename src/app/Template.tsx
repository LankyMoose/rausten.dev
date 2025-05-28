import { Link } from "$/components/Link"
import { SocialLink } from "$/components/SocialLink"

type TemplateProps = {
  children: JSX.Children
}
export function Template({ children }: TemplateProps) {
  return (
    <>
      <header className="p-4 w-full max-w-3xl lg:max-w-5xl mx-auto">
        <nav className="flex gap-4 items-center justify-between w-full max-w-5xl mx-auto">
          <div className="flex gap-4">
            <Link to="/" className="flex items-center">
              <img src="/icons/logo.svg" alt="Logo" />
            </Link>
            <Link to="/blog" className="flex items-center">
              Blog
            </Link>
            <a href="/Rob-Austen-Resume.pdf" target="_blank">
              Resume
            </a>
          </div>

          <iframe
            src="https://github.com/sponsors/LankyMoose/button"
            title="Sponsor LankyMoose"
            height="32"
            width="114"
            style="border: 0; border-radius: 6px;"
          ></iframe>
        </nav>
      </header>
      <main className="p-4 flex flex-col gap-6 grow w-full max-w-3xl lg:max-w-5xl mx-auto">
        {children}
      </main>
      <footer className="flex flex-col gap-2 px-1">
        <div className="flex gap-4 items-center mx-auto">
          <SocialLink href="https://www.github.com/lankymoose">
            <img src="/icons/github.svg" alt="Github" />
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/in/rausten/">
            <img src="/icons/linkedin.svg" alt="LinkedIn" />
          </SocialLink>
          <SocialLink href="https://www.x.com/lankymoose/">
            <img src="/icons/x.svg" alt="X" />
          </SocialLink>
          <SocialLink href="https://www.twitch.tv/lankymoosecodes">
            <img src="/icons/twitch.svg" alt="Twitch" />
          </SocialLink>
        </div>
        <div className="flex justify-end">
          <span className="font-light text-neutral-300">
            Made with{" "}
            <a href="https://kaioken.dev" target="_blank">
              Kaioken
            </a>
          </span>
        </div>
      </footer>
    </>
  )
}
