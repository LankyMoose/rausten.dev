import Github from "$/components/icons/github"
import Linkedin from "$/components/icons/linkedin"
import Logo from "$/components/icons/logo"
import Twitch from "$/components/icons/twitch"
import X from "$/components/icons/x"
import { Link } from "$/components/Link"
import { SocialLink } from "$/components/SocialLink"

export const App: Kiru.FC = ({ children }) => {
  return (
    <>
      <header className="p-4 w-full max-w-3xl lg:max-w-3xl mx-auto">
        <nav className="flex gap-4 items-center justify-between w-full max-w-3xl mx-auto">
          <div className="flex gap-4">
            <Link to="/" className="flex items-center">
              <Logo title="rausten.dev" />
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
      <main className="p-4 flex flex-col gap-6 grow w-full max-w-3xl lg:max-w-3xl mx-auto">
        {children}
      </main>
      <footer className="flex flex-col gap-4 px-1 py-4">
        <div className="flex gap-4 items-center mx-auto">
          <SocialLink href="https://www.github.com/lankymoose">
            <Github title="GitHub" />
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/in/rausten/">
            <Linkedin title="LinkedIn" />
          </SocialLink>
          <SocialLink href="https://www.x.com/lankymoose/">
            <X title="X" />
          </SocialLink>
          <SocialLink href="https://www.twitch.tv/lankymoosecodes">
            <Twitch title="Twitch" />
          </SocialLink>
        </div>
      </footer>
    </>
  )
}
