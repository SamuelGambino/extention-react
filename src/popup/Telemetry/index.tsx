import React, { useEffect, useState } from 'react';
import './index.css';

const BASE_GROW = { small: 1, middle: 2, large: 3 } as const;
type BarSize = keyof typeof BASE_GROW;

const BARS_CONFIG: { id: number; size: BarSize }[] = [
  { id: 0, size: 'small' },
  { id: 1, size: 'middle' },
  { id: 2, size: 'small' },
  { id: 3, size: 'large' },
  { id: 4, size: 'middle' },
  { id: 5, size: 'small' },
  { id: 6, size: 'large' },
  { id: 7, size: 'small' },
  { id: 8, size: 'large' },
  { id: 9, size: 'middle' },
  { id: 10, size: 'large' },
  { id: 11, size: 'small' },
  { id: 12, size: 'large' },
  { id: 13, size: 'small' },
  { id: 14, size: 'middle' },
  { id: 15, size: 'large' },
  { id: 16, size: 'small' },
  { id: 17, size: 'large' },
  { id: 18, size: 'middle' },
];

const BOOST = 3.5;

const Telemetry: React.FC = () => {
  const [activeIds, setActiveIds] = useState<number[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomId = BARS_CONFIG[Math.floor(Math.random() * BARS_CONFIG.length)].id;
      setActiveIds(prev => [...prev, randomId]);
      setTimeout(() => {
        setActiveIds(prev => prev.filter(id => id !== randomId));
      }, 1800);
    }, 800);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="telemetry">
      {BARS_CONFIG.map(bar => {
        const isActive = activeIds.includes(bar.id);
        const baseGrow = BASE_GROW[bar.size];
        return (
          <span
            key={bar.id}
            style={{ flexGrow: isActive ? baseGrow * BOOST : baseGrow }}
            className={isActive ? 'active' : ''}
          />
        );
      })}
    </div>
  );
};

export default Telemetry;