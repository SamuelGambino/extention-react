import type React from 'react';
import './index.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import ScrambleText from '../ScrambleText';

interface IInputField {
  type: 'input';
  placeholder?: string;
  value: string;
  button?: React.ReactNode;
}

interface ISwitchField {
  type: 'switch';
  value: boolean;
}

interface ISelectField {
  type: 'select';
  value: string;
  options: { label: string; value: string }[];
}

type FormFieldType = IInputField | ISwitchField | ISelectField;

interface IFormFieldProps {
  label: string;
  hint?: string;
  isAccent: boolean;
  field: FormFieldType;
  onChange: (value: string | boolean) => void;
}

const PHASE1_DURATION = 220;
const MAX_WIDTH = 200;

const measureTooltip = (text: string): { width: number; height: number } => {
  const el = document.createElement('span');
  el.style.cssText = `
    position: absolute;
    visibility: hidden;
    word-break: break-word;
    max-width: ${MAX_WIDTH}px;
    padding: 6px 10px;
    line-height: 1.4;
  `;
  el.textContent = text;
  document.body.appendChild(el);
  const w = Math.min(el.offsetWidth, MAX_WIDTH);
  const h = el.offsetHeight;
  document.body.removeChild(el);
  return { width: w, height: h };
}

const easeInOut = (p: number) => {
  return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
};

const useTooltipAnimation = (hint: string | undefined) => {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scramblePlaying, setScramblePlaying] = useState(false);

  const rafRef = useRef<number | null>(null);
  const scrambleRafRef = useRef<number | null>(null);

  const cancelAll = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (scrambleRafRef.current !== null) cancelAnimationFrame(scrambleRafRef.current);
  }, []);

  const show = useCallback(() => {
    if (!hint) return;
    cancelAll();

    const { width: targetW, height: targetH } = measureTooltip(hint);

    setVisible(true);
    setWidth(0);
    setHeight(targetH);

    let startTime: number | null = null;

    const phase1 = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / PHASE1_DURATION, 1);
      setWidth(easeInOut(p) * targetW);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(phase1);
      } else {
        setWidth(targetW);
        setScramblePlaying(true);
      }
    }

    rafRef.current = requestAnimationFrame(phase1);
  }, [hint, cancelAll]);

  const hide = useCallback(() => {
    cancelAll();
    setScramblePlaying(false);
    setWidth(0);
    setHeight(0);
    setTimeout(() => {
      setVisible(false);
    }, 300);
  }, [cancelAll]);

  useEffect(() => () => cancelAll(), [cancelAll]);

  return { visible, width, height, scramblePlaying, show, hide };
}

const FormField: React.FC<IFormFieldProps> = ({ label, hint, isAccent, field, onChange }) => {
  const { visible, width, height, scramblePlaying, show, hide } = useTooltipAnimation(hint);

  const renderField = () => {
    switch (field.type) {
      case 'input':
        return (
          <div className='form-field__input-wrapper'>
            <input
              className={`form-field__input ${isAccent ? 'form-field__input--accent' : ''}`}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => onChange(e.target.value)}
            />
            {field.button}
          </div>
        );
      case 'switch':
        return (
          <label className={`form-field__switch ${isAccent ? 'form-field__switch--accent' : ''}`}>
            <input
              type='checkbox'
              checked={field.value}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className='form-field__slider' />
          </label>
        );
      case 'select':
        return (
          <select
            className={`form-field__select ${isAccent ? 'form-field__select--accent' : ''}`}
            value={field.options.find(option => option.value === field.value)?.value || ''}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  }

  return (
    <div className='form-field'>
      <div className='form-field__title'>
        <label className='form-field__label'>{label}</label>
        {hint && (
          <div className="form-field__hint-wrapper"
            onMouseEnter={show}
            onMouseLeave={hide}>
            <svg
              className="form-field__icon"
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

            {visible && (
              <div
                className="form-field__tooltip"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  transition: width === 0 ? 'width 0.18s ease, height 0.12s ease 0.1s' : 'none',
                }}
              >
                <ScrambleText
                  className="form-field__tooltip-text"
                  text={hint}
                  play={scramblePlaying}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {renderField()}
    </div>
  )
}

export default FormField;