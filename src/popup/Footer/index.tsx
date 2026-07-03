import ScrambleText from '../ScrambleText';
import './index.css'
import manifest from '../../../manifest.json'
import { useVersion } from '../hooks/useStorage';

const Footer = () => {
  const [version] = useVersion();

  return (
    <footer className='footer'>
      <p className='footer__text'>ProductParser v{manifest.version}</p>

      {version.hasUpdate && (
        <span>Доступна новая версия - {version.latestVersion}! <a href={version.releaseUrl} target="_blank" rel="noopener noreferrer">Скачать</a></span>
      )}

      <a
        className='footer__text footer__text--link'
        href="https://t.me/Samuel_Gambino"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ScrambleText className='footer__scramble' text="developer" play={true} repeatInterval={3000} />
        <svg className='footer__icon' width="15" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.4997 14.5V0.5H0.5" stroke="#4A4956" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14.5 0.5L0.780273 14.2205" stroke="#4A4956" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </footer>
  )
}

export default Footer;