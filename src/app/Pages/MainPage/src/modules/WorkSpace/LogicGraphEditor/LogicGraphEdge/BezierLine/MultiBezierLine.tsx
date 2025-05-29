import React from "react";

interface Point {
  x: number;
  y: number;
}

interface MultiBezierRendererProps {
  start: Point[];
  end: Point[];
}

const MultiBezierRenderer: React.FC<MultiBezierRendererProps> = ({ start, end }) => {
  if (start.length !== end.length) {
    console.warn("start 和 end 数组长度不一致，不能生成边");
    return null;
  }

  return (
    <svg className="absolute w-full h-full pointer-events-none">
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
        </marker>
      </defs>

      {start.map((s, i) => {
        const e = end[i];
        const dx = Math.abs(e.x - s.x) * 0.5;
        const control1 = { x: s.x + dx, y: s.y };
        const control2 = { x: e.x - dx, y: e.y };

        const path = `M ${s.x},${s.y} C ${control1.x},${control1.y} ${control2.x},${control2.y} ${e.x},${e.y}`;

        return (
          <path
            key={i}
            d={path}
            stroke="black"
            strokeWidth={2}
            fill="none"
            markerEnd="url(#arrow)"
          />
        );
      })}
    </svg>
  );
};

export default MultiBezierRenderer;
