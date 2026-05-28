import './index.css';
import { useState } from 'react';
import ScrambleText from '../ScrambleText';

interface HintProps {
  hint: string;
  hintPosition?: 'left' | 'right';
}

const Hint = ({ hint, hintPosition }: HintProps) => {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
    setPlaying(true);
  };

  const hide = () => {
    setVisible(false);
    setPlaying(false);
  };

  return (
    <div className="hint" onMouseEnter={show} onMouseLeave={hide}>
      <svg
        className="hint__icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7.5" stroke="white" />
        <path
          d="M7.76705 12V6.54545H8.60511V12H7.76705ZM8.19318 5.63636C8.02983 5.63636 7.88897 5.58073 7.7706 5.46946C7.65459 5.35819 7.59659 5.22443 7.59659 5.06818C7.59659 4.91193 7.65459 4.77817 7.7706 4.6669C7.88897 4.55563 8.02983 4.5 8.19318 4.5C8.35653 4.5 8.49621 4.55563 8.61222 4.6669C8.73059 4.77817 8.78977 4.91193 8.78977 5.06818C8.78977 5.22443 8.73059 5.35819 8.61222 5.46946C8.49621 5.58073 8.35653 5.63636 8.19318 5.63636Z"
          fill="white"
        />
      </svg>

      <div className={`hint__tooltip ${visible ? 'hint__tooltip--visible' : ''} ${hintPosition === 'left' ? 'hint__tooltip--left' : ''}`}>
        <ScrambleText
          className="hint__tooltip-text"
          text={hint}
          play={playing}
        />
      </div>
    </div>
  );
};

export default Hint;