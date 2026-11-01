import { useState, useEffect, useRef } from 'react';

const lerpColor = (a, b, t) => {
  return a.map((v, i) => v + (b[i] - v) * t);
};

const CountdownTimer = ({ targetTime, onExpire }) => {
  const [display, setDisplay] = useState({ mStr: '10', sStr: '00', rgbColor: 'rgb(0,255,255)' });
  const rafRef = useRef(null);
  const expiredRef = useRef(false);

  const cyan = [0, 255, 255];
  const green = [0, 255, 100];
  const amber = [255, 200, 0];
  const red = [255, 0, 50];

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, targetTime - now);
      const totalDuration = 5 * 60 * 1000;
      const progress = timeLeft / totalDuration;

      const totalSeconds = Math.floor(timeLeft / 1000);
      const ms = timeLeft % 1000;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const frac = Math.floor(ms / 10);

      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');
      const fStr = String(frac).padStart(2, '0');

      let currentColor;
      if (progress > 0.9) {
        currentColor = lerpColor(cyan, green, (progress - 0.9) / 0.1);
      } else if (progress > 0.5) {
        currentColor = lerpColor(green, amber, (progress - 0.5) / 0.4);
      } else if (progress > 0.15) {
        currentColor = lerpColor(amber, red, (progress - 0.15) / 0.35);
      } else {
        currentColor = red;
      }

      const rgbColor = `rgb(${currentColor.map(Math.round).join(',')})`;

      setDisplay({ mStr, sStr, fStr, rgbColor });

      if (timeLeft <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetTime, onExpire]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[#666666] text-xs uppercase tracking-widest">Hold your seats</p>
      <div
        className="font-mono text-6xl font-bold tracking-widest flex"
        style={{ color: display.rgbColor }}
      >
        <span className="inline-block w-[1.6em] text-right">{display.mStr}</span>
        <span className="animate-pulse">:</span>
        <span className="inline-block w-[1.6em] text-left">{display.sStr}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
