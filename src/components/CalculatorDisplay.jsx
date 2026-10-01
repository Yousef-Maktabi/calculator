import {
  Check,
  Clock3,
  Copy,
  Delete as Backspace,
  Share2,
  X,
} from "lucide-react";
import { formatDisplay, tidyNumber } from "../calculator/utils";

function StatusMessage({ copyStatus, shareStatus }) {
  if (shareStatus === "shared") return "Shared!";
  if (shareStatus === "copied") return "Copied to share!";
  if (shareStatus === "failed") return "Share failed";
  if (copyStatus === "failed") return "Copy failed";
  return "Copied!";
}

export default function CalculatorDisplay({
  backspace,
  copyResult,
  copyStatus,
  display,
  expression,
  hasMemory,
  isHistoryOpen,
  memory,
  shareResult,
  shareStatus,
  toggleHistory,
}) {
  const hasStatus = copyStatus !== "idle" || shareStatus !== "idle";
  const hasFailed = copyStatus === "failed" || shareStatus === "failed";

  return (
    <div className="flex min-h-52 flex-col justify-end px-7 pb-6 pt-8 text-right">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={backspace}
            className="grid size-9 place-items-center rounded-full text-[#ad4168] transition hover:bg-white/70 active:scale-95"
            aria-label="Delete last digit"
          >
            <Backspace size={19} strokeWidth={1.8} />
          </button>
          {hasMemory && (
            <span
              className="grid size-6 place-items-center rounded-full bg-[#ad4168] text-xs font-bold text-white"
              title={`Memory: ${formatDisplay(tidyNumber(memory))}`}
              aria-label={`Memory contains ${formatDisplay(tidyNumber(memory))}`}
            >
              M
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`mr-1 text-xs font-semibold transition-opacity ${
              hasStatus ? "opacity-100" : "opacity-0"
            } ${hasFailed ? "text-[#a52a52]" : "text-[#7d3150]"}`}
            aria-live="polite"
          >
            <StatusMessage
              copyStatus={copyStatus}
              shareStatus={shareStatus}
            />
          </span>
          <button
            type="button"
            onClick={copyResult}
            disabled={display === "Error"}
            className="grid size-9 place-items-center rounded-full text-[#ad4168] transition hover:bg-white/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={copyStatus === "copied" ? "Result copied" : "Copy result"}
          >
            {copyStatus === "copied" ? (
              <Check size={19} strokeWidth={2} />
            ) : (
              <Copy size={18} strokeWidth={1.8} />
            )}
          </button>
          <button
            type="button"
            onClick={shareResult}
            disabled={display === "Error"}
            className="grid size-9 place-items-center rounded-full text-[#ad4168] transition hover:bg-white/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Share result"
          >
            <Share2 size={18} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={toggleHistory}
            className="grid size-9 place-items-center rounded-full text-[#ad4168] transition hover:bg-white/70 active:scale-95"
            aria-label={
              isHistoryOpen
                ? "Close calculation history"
                : "Open calculation history"
            }
            aria-expanded={isHistoryOpen}
            aria-controls="calculation-history"
          >
            {isHistoryOpen ? (
              <X size={19} strokeWidth={1.8} />
            ) : (
              <Clock3 size={19} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      <p
        className="h-6 truncate text-sm font-medium tracking-wide text-[#b5708a]"
        aria-live="polite"
      >
        {expression || "Ready to calculate"}
      </p>
      <output
        className="mt-2 block truncate text-[clamp(3rem,16vw,4.5rem)] font-semibold leading-none tracking-[-0.06em] text-[#54142f]"
        aria-live="polite"
      >
        {formatDisplay(display)}
      </output>
    </div>
  );
}
