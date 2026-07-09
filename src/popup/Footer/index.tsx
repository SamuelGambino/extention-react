import ScrambleText from '../ScrambleText';
import './index.css'
import browser from "webextension-polyfill";
import { useVersion } from '../hooks/useStorage';

const Footer = () => {
  const [version] = useVersion();
  const currentVersion = browser.runtime.getManifest().version;

  return (
    <footer className='footer'>
      <a className='footer__text' href="https://github.com/SamuelGambino/extention-react" target="_blank" rel="noopener noreferrer">ProductParser v{currentVersion}</a>

      {version.hasUpdate && (
        <a className='footer__text footer__text--link footer__text--link-accent' href={version.releaseUrl} target="_blank" rel="noopener noreferrer">Обновитесь до версии {version.latestVersion}</a>
      )}

      <a
        className='footer__text footer__text--link footer__text--right'
        href="https://t.me/Samuel_Gambino"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ScrambleText text="developer" play={true} repeatInterval={3000} />
        <svg className='footer__icon' width="15" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.4997 14.5V0.5H0.5" stroke="#4A4956" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14.5 0.5L0.780273 14.2205" stroke="#4A4956" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </footer>
  )
}

export default Footer;