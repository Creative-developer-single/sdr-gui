import React from "react";

interface Point {
  x: number;
  y: number;
}

interface GnuRadioBezierProps {
  start: Point;
  end: Point;
  width?: number;
  height?: number;
}



const GnuRadioBezier: React.FC<GnuRadioBezierProps> = ({
  start,
  end,
  width = 400,
  height = 200,
}) => {
  // 自动计算控制点
  const dx = Math.abs(end.x - start.x) * 0.5;
  const control1 = { x: start.x + dx, y: start.y };
  const control2 = { x: end.x - dx, y: end.y };

  const path = `M ${start.x},${start.y} C ${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`;

  return (
    <svg className='absolute' width="100%" height="100%">
      <path d={path} stroke="black" strokeWidth={2} fill="none" />
      <circle cx={start.x} cy={start.y} r={4} fill="green" />
      <circle cx={end.x} cy={end.y} r={4} fill="red" />
    </svg>
);
};

export default GnuRadioBezier;
