"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface RadarAxis {
  label: string;
  percent: number;
}

interface RadarChartProps {
  values: RadarAxis[];
  size?: number;
  dark?: boolean;
  staticMode?: boolean;
  center?: ReactNode;
  className?: string;
}

const S = 340;
const C = S / 2;
const R = 108;
const LABEL_R = R + 34;

function point(index: number, radius: number): [number, number] {
  const angle = (-90 + index * 72) * (Math.PI / 180);
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)];
}

function polygon(indexCount: number, radius: number): string {
  return Array.from({ length: indexCount }, (_, i) => point(i, radius).join(",")).join(" ");
}

export function RadarChart({ values, size = 340, dark = false, staticMode = false, center, className = "" }: RadarChartProps) {
  const n = values.length;
  const valuePoints = values
    .map((v, i) => point(i, (R * Math.max(2, v.percent)) / 100).join(","))
    .join(" ");

  const gridStroke = dark ? "rgba(246,245,241,0.14)" : "rgba(12,14,13,0.14)";
  const axisStroke = dark ? "rgba(246,245,241,0.18)" : "rgba(12,14,13,0.18)";
  const labelFill = dark ? "rgba(246,245,241,0.62)" : "rgba(12,14,13,0.62)";

  const valuePolygon = (
    <motion.polygon
      points={valuePoints}
      fill="rgba(0,168,107,0.22)"
      stroke="#00a86b"
      strokeWidth={2}
      strokeLinejoin="round"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={staticMode ? false : { opacity: 0, scale: 0.55 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.25 }}
    />
  );

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "100%", maxWidth: size, aspectRatio: "1" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} className="h-full w-full">
        {/* grid rings */}
        {[25, 50, 75, 100].map((p) => (
          <polygon
            key={p}
            points={polygon(n, (R * p) / 100)}
            fill="none"
            stroke={gridStroke}
            strokeWidth={p === 100 ? 1.4 : 1}
          />
        ))}
        {/* axes */}
        {values.map((v, i) => {
          const [x, y] = point(i, R);
          return (
            <line key={v.label} x1={C} y1={C} x2={x} y2={y} stroke={axisStroke} strokeWidth={1} />
          );
        })}
        {/* value polygon */}
        {valuePolygon}
        {/* vertices */}
        {values.map((v, i) => {
          const [x, y] = point(i, (R * Math.max(2, v.percent)) / 100);
          return <circle key={v.label} cx={x} cy={y} r={4} fill="#00a86b" stroke={dark ? "#0c0e0d" : "#ffffff"} strokeWidth={1.5} />;
        })}
        {/* labels */}
        {values.map((v, i) => {
          const [x, y] = point(i, LABEL_R);
          const cos = Math.cos((-90 + i * 72) * (Math.PI / 180));
          const anchor = Math.abs(cos) < 0.35 ? "middle" : cos > 0 ? "start" : "end";
          return (
            <text
              key={v.label}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill={labelFill}
              style={{
                fontFamily: "var(--font-plex-arabic), sans-serif",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {v.label}
            </text>
          );
        })}
      </svg>
      {center ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">{center}</div>
      ) : null}
    </div>
  );
}
