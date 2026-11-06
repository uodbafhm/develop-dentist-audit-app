"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  scoreClassName?: string;
  mutedClassName?: string;
}

export function ScoreRing({
  score,
  size = 200,
  stroke = 11,
  color = "#00a86b",
  trackColor = "rgba(246,245,241,0.12)",
  scoreClassName = "",
  mutedClassName = "",
}: ScoreRingProps) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => String(Math.round(v)));

  useEffect(() => {
    const controls = animate(mv, score, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [mv, score]);

  const r = (size - stroke) / 2;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - score }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <motion.span className={`font-display font-bold tabular-nums ${scoreClassName}`}>
            {rounded}
          </motion.span>
          <span className={`font-mono ${mutedClassName}`}>/100</span>
        </div>
      </div>
    </div>
  );
}
