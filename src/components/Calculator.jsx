import { useCalculator } from "../calculator/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorHistory from "./CalculatorHistory";
import CalculatorKeypad from "./CalculatorKeypad";

export default function Calculator({ isActive = true }) {
  const calculator = useCalculator(isActive);

  return (
    <div className="overflow-hidden rounded-[1.65rem] bg-[#ffe7ee]">
      <CalculatorDisplay
        backspace={calculator.backspace}
        copyResult={calculator.copyResult}
        copyStatus={calculator.copyStatus}
        display={calculator.display}
        expression={calculator.expression}
        hasMemory={calculator.hasMemory}
        isHistoryOpen={calculator.isHistoryOpen}
        memory={calculator.memory}
        shareResult={calculator.shareResult}
        shareStatus={calculator.shareStatus}
        toggleHistory={calculator.toggleHistory}
      />
      <CalculatorHistory
        clearHistory={calculator.clearHistory}
        history={calculator.history}
        isOpen={calculator.isHistoryOpen}
        reuseResult={calculator.reuseHistoryResult}
      />
      <CalculatorKeypad
        display={calculator.display}
        handleAction={calculator.handleAction}
        handleMemoryAction={calculator.handleMemoryAction}
        hasMemory={calculator.hasMemory}
        operator={calculator.operator}
        waitingForOperand={calculator.waitingForOperand}
      />
    </div>
  );
}
