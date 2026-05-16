import './index.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <p className='footer__text'>ProductParser v2.0.0</p>
      <a
        className='footer__text footer__text--link'
        href="https://t.me/Samuel_Gambino"
        target="_blank"
        rel="noopener noreferrer"
      >
        developer
        <svg className='footer__icon' width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.4996 15.5V0.5H0.5" stroke="#4A4956" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.5 0.5L0.800293 15.2006" stroke="#4A4956" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </footer>
  )
}

export default Footer;