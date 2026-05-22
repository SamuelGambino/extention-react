import { useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
const CHAR_SCRAMBLE_DURATION = 380;
const CHAR_SETTLE_DELAY = 18;

function rand() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface IScrambleTextProps {
  text: string;
  play: boolean;
  repeatInterval?: number;
  className?: string;
  onComplete?: () => void;
}

const ScrambleText: React.FC<IScrambleTextProps> = ({
  text,
  play,
  repeatInterval,
  className,
  onComplete,
}) => {
  const elRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
  }, []);

  const animate = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const element = el;

    const len = text.length;
    const settled = new Array(len).fill(false);
    let settledCount = 0;
    const startTimes = Array.from({ length: len }, (_, i) => i * CHAR_SETTLE_DELAY);
    const scrambleStart = performance.now();

    function frame(now: number) {
      const elapsed = now - scrambleStart;
      let display = '';

      for (let i = 0; i < len; i++) {
        if (settled[i]) {
          display += text[i];
        } else if (elapsed >= startTimes[i]) {
          const charElapsed = elapsed - startTimes[i];
          if (charElapsed >= CHAR_SCRAMBLE_DURATION) {
            settled[i] = true;
            settledCount++;
            display += text[i];
          } else {
            display += text[i] === ' ' ? ' ' : rand();
          }
        } else {
          display += ' ';
        }
      }

      element.textContent = display;

      if (settledCount < len) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        element.textContent = text;
        onComplete?.();

        if (repeatInterval) {
          repeatTimerRef.current = setTimeout(animate, repeatInterval);
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [text, repeatInterval, onComplete]);

  useEffect(() => {
    if (play) {
      cancel();
      animate();
    } else {
      cancel();
      if (elRef.current) elRef.current.textContent = '';
    }

    return cancel;
  }, [play, animate, cancel]);

  return <span ref={elRef} className={className} />;
};

export default ScrambleText;