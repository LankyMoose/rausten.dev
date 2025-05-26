import "./styles.css"
import { Link } from "$/components/Link"
import { GithubIcon } from "$/components/icons/GithubIcon"
import { LinkedInIcon } from "$/components/icons/LinkedInIcon"
import { LogoIcon } from "$/components/icons/LogoIcon"
import { XIcon } from "$/components/icons/XIcon"
import { TwitchIcon } from "$/components/icons/TwitchIcon"
import { SocialLink } from "$/components/SocialLink"

type TemplateProps = {
  children: JSX.Children
}
export function Template({ children }: TemplateProps) {
  return (
    <>
      <header>
        <nav className="flex gap-4 items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex gap-4">
            <Link to="/" className="flex items-center">
              <LogoIcon />
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
      <main>{children}</main>
      <footer className="flex flex-col gap-2">
        <div className="flex gap-4 items-center mx-auto">
          <SocialLink href="https://www.github.com/lankymoose">
            <GithubIcon />
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/in/rausten/">
            <LinkedInIcon />
          </SocialLink>
          <SocialLink href="https://www.x.com/lankymoose/">
            <XIcon />
          </SocialLink>
          <SocialLink href="https://www.twitch.tv/lankymoosecodes">
            <TwitchIcon />
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
