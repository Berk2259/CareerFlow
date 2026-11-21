"use client";

import { useEffect, useRef } from "react";

type StatItem = { key: string; label: string; count: number; color: string };

export default function MonthlyStatsDonut({
  items,
  total,
}: {
  items: StatItem[];
  total: number;
}) {
  const segRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (total === 0) {
      rowRefs.current.forEach((row) => {
        row?.classList.remove("opacity-35");
        row?.classList.add("opacity-100");
      });
      return;
    }
    const C = 289; // 2 * PI * 46
    let cumulative = 0;

    items.forEach((item, i) => {
      const seg = segRefs.current[i];
      const pulse = pulseRefs.current[i];
      const row = rowRefs.current[i];
      if (!seg || !pulse) return;

      const len = (item.count / total) * C;
      const offset = C - len;
      const rotate = (cumulative / total) * 360;

      seg.style.transform = `rotate(${rotate}deg)`;
      seg.style.transformOrigin = "59px 59px";
      pulse.style.transform = `rotate(${rotate}deg)`;
      pulse.style.transformOrigin = "59px 59px";
      pulse.style.strokeDasharray = `${C}`;
      pulse.style.strokeDashoffset = `${offset}`;

      const delay = 150 + i * 220;
      setTimeout(() => {
        seg.style.strokeDashoffset = `${offset}`;
        pulse.classList.add("donut-pulse-ring");
        row?.classList.remove("opacity-35");
        row?.classList.add("opacity-100", "bg-slate-50");
      }, delay);

      cumulative += item.count;
    });
  }, [items, total]);

  return (
    <div className="flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-shrink-0 items-center justify-center border-r border-slate-100 px-7 py-6">
        <div className="relative h-[118px] w-[118px]">
          <svg
            width="118"
            height="118"
            viewBox="0 0 118 118"
            className="-rotate-90 overflow-visible"
          >
            <circle cx="59" cy="59" r="46" fill="none" stroke="#f1f5f9" strokeWidth="13" />
            {items.map((item, i) => (
              <circle
                key={`pulse-${item.key}`}
                ref={(el) => {
                  pulseRefs.current[i] = el;
                }}
                cx="59"
                cy="59"
                r="46"
                fill="none"
                stroke={item.color}
                strokeWidth="1.5"
                opacity="0"
              />
            ))}
            {items.map((item, i) => (
              <circle
                key={`seg-${item.key}`}
                ref={(el) => {
                  segRefs.current[i] = el;
                }}
                cx="59"
                cy="59"
                r="46"
                fill="none"
                stroke={item.color}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray="289"
                strokeDashoffset="289"
                style={{ transition: "stroke-dashoffset 0.85s cubic-bezier(.34,1.3,.4,1)" }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="donut-fade-1 text-[26px] font-extrabold leading-none text-slate-900">
              {total}
            </span>
            <span className="donut-fade-2 mt-[3px] text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Toplam
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0.5 px-5 py-3.5">
        {items.map((item, i) => (
          <div
            key={item.key}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 opacity-35 transition-opacity duration-300"
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-[3px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-[12.5px] font-bold text-slate-600">{item.label}</span>
            <span className="w-9 text-[11px] font-bold text-slate-400">
              %{total > 0 ? Math.round((item.count / total) * 100) : 0}
            </span>
            <span className="w-[18px] text-right text-[15px] font-extrabold text-slate-900">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}