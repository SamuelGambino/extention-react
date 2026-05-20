import type React from 'react';
import './index.css'
import { useCallback, useEffect, useRef, useState } from 'react';

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

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
const PHASE1_DURATION = 220;
const CHAR_SCRAMBLE_DURATION = 380;
const CHAR_SETTLE_DELAY = 18;

function rand() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function measureText(text: string): number {
  const el = document.createElement('span');
  el.style.cssText =
    'position:absolute;visibility:hidden;white-space:nowrap;font-size:13px;font-family:monospace;padding:6px 10px;';
  el.textContent = text;
  document.body.appendChild(el);
  const w = el.offsetWidth;
  document.body.removeChild(el);
  return w;
}

function easeInOut(p: number) {
  return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
}

function useTooltipAnimation(hint: string | undefined) {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const rafRef = useRef<number | null>(null);
  const scrambleRafRef = useRef<number | null>(null);

  const cancelAll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (scrambleRafRef.current) cancelAnimationFrame(scrambleRafRef.current);
  }, []);

  const show = useCallback(() => {
    if (!hint) return;
    cancelAll();

    const targetW = measureText(hint);
    const TOOLTIP_HEIGHT = 32;

    setVisible(true);
    setWidth(0);
    setHeight(TOOLTIP_HEIGHT);
    setDisplayText('');

    let startTime: number | null = null;

    function phase1(ts: number) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / PHASE1_DURATION, 1);
      setWidth(easeInOut(p) * targetW);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(phase1);
      } else {
        setWidth(targetW);
        startScramble();
      }
    }

    function startScramble() {
      const len = hint!.length;
      const settled = new Array(len).fill(false);
      let settledCount = 0;
      const startTimes = Array.from({ length: len }, (_, i) => i * CHAR_SETTLE_DELAY);
      const scrambleStart = performance.now();

      function frame(now: number) {
        const elapsed = now - scrambleStart;
        let display = '';

        for (let i = 0; i < len; i++) {
          if (settled[i]) {
            display += hint![i];
          } else if (elapsed >= startTimes[i]) {
            const charElapsed = elapsed - startTimes[i];
            if (charElapsed >= CHAR_SCRAMBLE_DURATION) {
              settled[i] = true;
              settledCount++;
              display += hint![i];
            } else {
              display += hint![i] === ' ' ? ' ' : rand();
            }
          } else {
            display += ' ';
          }
        }

        setDisplayText(display);

        if (settledCount < len) {
          scrambleRafRef.current = requestAnimationFrame(frame);
        } else {
          setDisplayText(hint!);
        }
      }

      scrambleRafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(phase1);
  }, [hint, cancelAll]);

  const hide = useCallback(() => {
    cancelAll();
    setWidth(0);
    setHeight(0);
    setTimeout(() => {
      setVisible(false);
      setDisplayText('');
    }, 300);
  }, [cancelAll]);

  useEffect(() => () => cancelAll(), [cancelAll]);

  return { visible, width, height, displayText, show, hide };
}

const FormField: React.FC<IFormFieldProps> = ({ label, hint, isAccent, field, onChange }) => {
  const { visible, width, height, displayText, show, hide } = useTooltipAnimation(hint);

  const renderField = () => {
    switch (field.type) {
      case 'input':
        return (
          <input
            className='form-field__input'
            placeholder={field.placeholder}
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'switch':
        return (
          <label className='form-field__switch'>
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
            className='form-field__select'
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
          <div className="form-field__hint-wrapper">
            <svg
              className="form-field__icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onMouseEnter={show}
              onMouseLeave={hide}
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
                <span className="form-field__tooltip-text">{displayText}</span>
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