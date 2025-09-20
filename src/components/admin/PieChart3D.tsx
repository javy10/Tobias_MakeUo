
'use client';

import React, { useState } from 'react';

// Function to darken a hex color
const darkenColor = (hex: string, amount: number): string => {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  const num = parseInt(hex, 16);
  let r = (num >> 16) - amount;
  if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) - amount;
  if (b < 0) b = 0;
  let g = (num & 0x0000FF) - amount;
  if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

// Function to convert HSL color string to HEX
const hslToHex = (hslStr: string): string => {
    // This function will only work on the client-side
    if (typeof window === 'undefined') {
        return '#cccccc'; // Default color for SSR
    }
    // Create a temporary element to resolve the CSS variable
    const tempDiv = document.createElement('div');
    tempDiv.style.color = hslStr;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // computedColor will be in 'rgb(r, g, b)' format
    const rgb = computedColor.match(/\d+/g);
    if (!rgb || rgb.length < 3) return '#cccccc';

    const [r, g, b] = rgb.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
};


interface PieSliceProps {
  cx: number;
  cy: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
  depth: number;
  isHovered: boolean;
}

const PieSlice: React.FC<PieSliceProps> = ({ cx, cy, radius, startAngle, endAngle, color, depth, isHovered }) => {
  const [hexColor, setHexColor] = useState('#cccccc');
  
  // Effect to convert HSL to HEX on the client side
  React.useEffect(() => {
    setHexColor(hslToHex(color));
  }, [color]);

  const adjustedRadius = isHovered ? radius * 1.05 : radius;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = cx + adjustedRadius * Math.cos(startRad);
  const y1 = cy + adjustedRadius * Math.sin(startRad);
  const x2 = cx + adjustedRadius * Math.cos(endRad);
  const y2 = cy + adjustedRadius * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  
  const sideColor = darkenColor(hexColor, 20);
  const bottomColor = darkenColor(hexColor, 40);

  const pathData = [
    `M ${cx},${cy}`,
    `L ${x1},${y1}`,
    `A ${adjustedRadius},${adjustedRadius} 0 ${largeArcFlag},1 ${x2},${y2}`,
    'Z'
  ].join(' ');

  const sidePaths = [];
  for (let i = 0; i < depth; i++) {
    const yOffset = i + 1;
    const sidePathData = [
      `M ${x1},${y1 + yOffset}`,
      `A ${adjustedRadius},${adjustedRadius} 0 ${largeArcFlag},1 ${x2},${y2 + yOffset}`,
      `L ${x2},${y2 + yOffset - 1}`,
      `A ${adjustedRadius},${adjustedRadius} 0 ${largeArcFlag},0 ${x1},${y1 + yOffset - 1}`,
      'Z'
    ].join(' ');
    sidePaths.push(<path key={`side-${i}`} d={sidePathData} fill={i === depth - 1 ? bottomColor : sideColor} />);
  }
  
  return (
    <g>
      {sidePaths}
      <path d={pathData} fill={hexColor} stroke="#fff" strokeWidth="1" />
    </g>
  );
};


interface PieChart3DProps {
  data: { name: string; value: number; color: string }[];
}

export const PieChart3D: React.FC<PieChart3DProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let startAngle = 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full">
      <svg width="250" height="250" viewBox="0 0 250 250">
        <g transform="scale(1, 0.7) translate(0, 35)">
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const endAngle = startAngle + angle;
            const slice = (
              <g
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <PieSlice
                  cx={125}
                  cy={125}
                  radius={100}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  color={item.color}
                  depth={15}
                  isHovered={hoveredIndex === index}
                />
              </g>
            );
            startAngle = endAngle;
            return slice;
          })}
        </g>
      </svg>
      <div className="flex flex-col gap-2 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className={hoveredIndex === index ? 'font-bold' : ''}>
              {item.name}: {item.value} ({(item.value / total * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
