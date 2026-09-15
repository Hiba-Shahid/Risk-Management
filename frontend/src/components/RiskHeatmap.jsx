const COLORS = [
  'bg-green-100 dark:bg-green-900/40',
  'bg-lime-100 dark:bg-lime-900/40',
  'bg-yellow-100 dark:bg-yellow-900/40',
  'bg-orange-100 dark:bg-orange-900/40',
  'bg-red-100 dark:bg-red-900/40',
];

export default function RiskHeatmap({ data = [] }) {
  const grid = Array.from({ length: 5 }, (_, impactIdx) =>
    Array.from({ length: 5 }, (_, probIdx) => {
      const impact = 5 - impactIdx;
      const probability = probIdx + 1;
      const cellRisks = data.filter(
        (r) => r.probability === probability && r.impact === impact
      );
      const score = probability * impact;
      const colorIdx = Math.min(4, Math.floor((score - 1) / 5));
      return { probability, impact, risks: cellRisks, score, colorIdx };
    })
  );

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-[320px]">
        <p className="text-xs text-slate-500 mb-2 text-center">Impact →</p>
        <div className="flex">
          <div className="flex flex-col justify-center pr-2">
            <p className="text-xs text-slate-500 -rotate-90 whitespace-nowrap">Probability</p>
          </div>
          <div>
            {grid.map((row, i) => (
              <div key={i} className="flex gap-1 mb-1">
                {row.map((cell) => (
                  <div
                    key={`${cell.probability}-${cell.impact}`}
                    title={`P:${cell.probability} I:${cell.impact} Score:${cell.score}`}
                    className={`w-14 h-14 rounded flex flex-col items-center justify-center text-xs border border-slate-200 dark:border-slate-700 ${COLORS[cell.colorIdx]}`}
                  >
                    <span className="font-bold">{cell.score}</span>
                    {cell.risks.length > 0 && (
                      <span className="text-[10px] text-slate-600">{cell.risks.length} risk</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
