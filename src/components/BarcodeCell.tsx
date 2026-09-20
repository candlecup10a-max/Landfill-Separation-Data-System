import React, { useMemo } from 'react';

interface BarcodeCellProps {
  code: string;
  className?: string;
  size?: 'compact' | 'standard' | 'large';
  showCodeText?: boolean;
}

/**
 * Deterministic visual barcode cell generator based on alphanumeric product string / GTIN / SKU.
 * Generates an industrial code-128 styled SVG bar pattern and format label.
 */
export const BarcodeCell: React.FC<BarcodeCellProps> = ({
  code,
  className = '',
  size = 'compact',
  showCodeText = true,
}) => {
  // Convert any string to deterministic bar widths (1, 2, 3) and spaces
  const { bars, checksum } = useMemo(() => {
    const clean = code.trim().toUpperCase() || 'ITM-000';
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash * 31 + clean.charCodeAt(i)) % 1000000007;
    }

    // Generate bar pattern with guard bars at start/end
    const pattern: number[] = [2, 1, 2]; // Start guard
    let currentHash = Math.abs(hash);

    for (let i = 0; i < clean.length; i++) {
      const charCode = clean.charCodeAt(i);
      const w1 = ((charCode ^ (currentHash % 7)) % 3) + 1;
      const w2 = (((charCode >> 2) ^ (i % 3)) % 3) + 1;
      const w3 = ((charCode + i) % 2) + 1;
      pattern.push(w1, w2, w3);
      currentHash = (currentHash * 17 + charCode) % 999983;
    }

    pattern.push(2, 1, 2); // Stop guard

    const checkDigit = Math.abs(hash % 90 + 10);
    return { bars: pattern, checksum: checkDigit };
  }, [code]);

  const height = size === 'compact' ? 14 : size === 'standard' ? 20 : 28;
  const barWidthUnit = size === 'compact' ? 1.2 : size === 'standard' ? 1.6 : 2.2;
  const totalWidth = bars.reduce((sum, w) => sum + w, 0) * barWidthUnit + 8;

  let currentX = 4;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center bg-white border border-slate-200/90 rounded-md px-1.5 py-0.5 shadow-2xs font-mono select-none ${className}`}
      title={`Barcode: ${code}`}
    >
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="overflow-visible"
        aria-label={`Barcode for ${code}`}
      >
        {bars.map((barWeight, index) => {
          const isBar = index % 2 === 0;
          const barW = barWeight * barWidthUnit;
          const x = currentX;
          currentX += barW;

          if (!isBar) return null;

          return (
            <rect
              key={index}
              x={x}
              y={0}
              width={barW}
              height={height}
              fill="#0f172a"
              rx={0.2}
            />
          );
        })}
      </svg>
      {showCodeText && (
        <div className="flex items-center justify-between w-full text-[8px] tracking-wider text-slate-600 font-bold leading-none mt-0.5 px-0.5">
          <span className="text-[7px] text-slate-400">||</span>
          <span className="font-mono truncate max-w-[100px]">{code}</span>
          <span className="text-[7px] text-slate-400">{checksum}</span>
        </div>
      )}
    </div>
  );
};
