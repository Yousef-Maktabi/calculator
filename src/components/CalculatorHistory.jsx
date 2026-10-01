import { Trash2 } from "lucide-react";
import { formatDisplay } from "../calculator/utils";

export default function CalculatorHistory({
  clearHistory,
  history,
  isOpen,
  reuseResult,
}) {
  return (
    <div
      id="calculation-history"
      className={`grid bg-[#fbd6e1] transition-[grid-template-rows] duration-300 ease-out ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="overflow-hidden">
        <div className="border-t border-[#eeb7c8] px-5 pb-4 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#6f2441]">
              Calculation history
            </h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#ad4168] transition hover:bg-white/60"
                aria-label="Clear calculation history"
              >
                <Trash2 size={14} strokeWidth={1.8} />
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="py-5 text-center text-sm text-[#a7667e]">
              Your completed calculations will appear here.
            </p>
          ) : (
            <ul className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => reuseResult(item)}
                    className="w-full rounded-xl bg-white/55 px-3 py-2 text-right transition hover:bg-white/90 active:scale-[0.99]"
                    aria-label={`Reuse result ${formatDisplay(item.result)} from ${item.expression}`}
                  >
                    <span className="block truncate text-xs text-[#a7667e]">
                      {item.expression} =
                    </span>
                    <span className="mt-0.5 block truncate text-lg font-bold text-[#641d3a]">
                      {formatDisplay(item.result)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
