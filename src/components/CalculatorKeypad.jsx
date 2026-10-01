import { calculatorKeys, memoryKeys } from "../calculator/config";

function keyClassName(key, isSelectedOperator) {
  return [
    "calculator-key h-[4.15rem] rounded-2xl text-xl font-semibold transition duration-150 active:translate-y-0.5 active:shadow-none",
    key.wide ? "col-span-2 text-left pl-7" : "",
    key.type === "number"
      ? "bg-[#a93463] text-white shadow-[0_5px_0_#762044] hover:bg-[#ba3a6c]"
      : "",
    key.type === "utility"
      ? "bg-[#f8b9cb] text-[#701d41] shadow-[0_5px_0_#d87b9a] hover:bg-[#ffc7d7]"
      : "",
    key.type === "operator"
      ? "bg-[#ff789e] text-[#5d1737] shadow-[0_5px_0_#d94a77] hover:bg-[#ff8dac]"
      : "",
    key.type === "equals"
      ? "bg-[#fff0f4] text-[#9b2755] shadow-[0_5px_0_#e7a6bb] hover:bg-white"
      : "",
    isSelectedOperator
      ? "ring-2 ring-white ring-offset-2 ring-offset-[#8e2351]"
      : "",
  ].join(" ");
}

export default function CalculatorKeypad({
  display,
  handleAction,
  handleMemoryAction,
  hasMemory,
  operator,
  waitingForOperand,
}) {
  return (
    <div className="grid grid-cols-4 gap-2.5 rounded-t-[1.75rem] bg-[#8e2351] p-4">
      {memoryKeys.map((key) => {
        const isDisabled =
          ((key.action === "clear" || key.action === "recall") &&
            !hasMemory) ||
          ((key.action === "add" || key.action === "subtract") &&
            display === "Error");

        return (
          <button
            key={key.label}
            type="button"
            onClick={() => handleMemoryAction(key.action)}
            disabled={isDisabled}
            className="h-9 rounded-xl bg-[#741c45] text-sm font-bold text-[#ffdce7] shadow-[0_3px_0_#571330] transition hover:bg-[#7f234b] active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={key.ariaLabel}
          >
            {key.label}
          </button>
        );
      })}

      {calculatorKeys.map((key) => (
        <button
          key={key.label}
          type="button"
          onClick={() => handleAction(key)}
          className={keyClassName(
            key,
            operator === key.label && waitingForOperand,
          )}
          aria-label={key.label === "AC" ? "Clear all" : key.label}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}
