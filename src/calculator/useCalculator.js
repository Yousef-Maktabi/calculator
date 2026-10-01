import { useCallback, useEffect, useState } from "react";
import { HISTORY_STORAGE_KEY, operations } from "./config";
import {
  formatDisplay,
  loadHistory,
  tidyNumber,
  writeToClipboard,
} from "./utils";

export function useCalculator(keyboardEnabled = true) {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [expression, setExpression] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState(loadHistory);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle");
  const [shareStatus, setShareStatus] = useState("idle");
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [lastOperation, setLastOperation] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // The calculator still works when storage is unavailable or full.
    }
  }, [history]);

  useEffect(() => {
    if (copyStatus === "idle") return undefined;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  useEffect(() => {
    if (shareStatus === "idle") return undefined;
    const timeout = window.setTimeout(() => setShareStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const calculate = useCallback(
    (left, right, nextOperator = operator) => {
      if (!nextOperator) return right;
      if (nextOperator === "÷" && right === 0) return NaN;
      return operations[nextOperator](left, right);
    },
    [operator],
  );

  const clear = useCallback(() => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setExpression("");
    setWaitingForOperand(false);
    setLastOperation(null);
  }, []);

  const inputDigit = useCallback(
    (digit) => {
      if (display === "Error" || waitingForOperand) {
        setDisplay(digit === "." ? "0." : digit);
        setWaitingForOperand(false);
        if (operator === null) setLastOperation(null);
        return;
      }
      if (digit === "." && display.includes(".")) return;
      if (display.replace("-", "").length >= 12) return;
      setDisplay((current) =>
        current === "0" && digit !== "." ? digit : current + digit,
      );
    },
    [display, operator, waitingForOperand],
  );

  const chooseOperator = useCallback(
    (nextOperator) => {
      const inputValue = Number(display);
      if (display === "Error") return clear();

      if (operator && waitingForOperand) {
        setOperator(nextOperator);
        setExpression((current) => current.replace(/[+−×÷]$/, nextOperator));
        return;
      }

      if (storedValue !== null && operator) {
        const result = calculate(storedValue, inputValue);
        const nextDisplay = tidyNumber(result);
        setDisplay(nextDisplay);
        if (nextDisplay === "Error") {
          setExpression("Cannot divide by zero");
          setStoredValue(null);
          setOperator(null);
          setWaitingForOperand(true);
          return;
        }
        setStoredValue(result);
        setExpression(`${nextDisplay} ${nextOperator}`);
      } else {
        setStoredValue(inputValue);
        setExpression(`${formatDisplay(display)} ${nextOperator}`);
      }

      setOperator(nextOperator);
      setWaitingForOperand(true);
    },
    [calculate, clear, display, operator, storedValue, waitingForOperand],
  );

  const equals = useCallback(() => {
    if (display === "Error") return;

    const hasPendingOperation = operator !== null && storedValue !== null;
    if (!hasPendingOperation && lastOperation === null) return;

    const leftValue = hasPendingOperation ? storedValue : Number(display);
    const rightValue = hasPendingOperation
      ? Number(display)
      : lastOperation.operand;
    const operation = hasPendingOperation ? operator : lastOperation.operator;
    const result = calculate(leftValue, rightValue, operation);
    const nextDisplay = tidyNumber(result);
    const completedExpression = `${formatDisplay(String(leftValue))} ${operation} ${formatDisplay(String(rightValue))}`;
    setExpression(
      nextDisplay === "Error"
        ? "Cannot divide by zero"
        : `${completedExpression} =`,
    );
    setDisplay(nextDisplay);
    if (nextDisplay !== "Error") {
      setHistory((current) => [
        {
          id: `${Date.now()}-${current.length}`,
          expression: completedExpression,
          result: nextDisplay,
        },
        ...current,
      ].slice(0, 20));
      setLastOperation({ operator: operation, operand: rightValue });
    } else {
      setLastOperation(null);
    }
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [calculate, display, lastOperation, operator, storedValue]);

  const reuseHistoryResult = useCallback((item) => {
    setDisplay(item.result);
    setExpression(`${item.expression} =`);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setLastOperation(null);
    setIsHistoryOpen(false);
  }, []);

  const copyResult = useCallback(async () => {
    if (display === "Error") return;

    try {
      await writeToClipboard(formatDisplay(display));
      setShareStatus("idle");
      setCopyStatus("copied");
    } catch {
      setShareStatus("idle");
      setCopyStatus("failed");
    }
  }, [display]);

  const shareResult = useCallback(async () => {
    if (display === "Error") return;

    const formattedResult = formatDisplay(display);
    const shareText = expression.trim().endsWith("=")
      ? `${expression} ${formattedResult}`
      : `Result: ${formattedResult}`;

    setCopyStatus("idle");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pink calculator result",
          text: shareText,
        });
        setShareStatus("shared");
      } catch (error) {
        if (error?.name !== "AbortError") setShareStatus("failed");
      }
      return;
    }

    try {
      await writeToClipboard(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  }, [display, expression]);

  const handleMemoryAction = useCallback(
    (action) => {
      if (action === "clear") {
        setMemory(0);
        setHasMemory(false);
        return;
      }

      if (action === "recall") {
        if (!hasMemory) return;
        setDisplay(tidyNumber(memory));
        if (operator === null) {
          setExpression("Memory recalled");
          setLastOperation(null);
        }
        setWaitingForOperand(false);
        return;
      }

      if (display === "Error") return;
      const inputValue = Number(display);
      setMemory((current) =>
        action === "add" ? current + inputValue : current - inputValue,
      );
      setHasMemory(true);
    },
    [display, hasMemory, memory, operator],
  );

  const handleAction = useCallback(
    (key) => {
      if (key.type === "number") return inputDigit(key.label);
      if (key.action === "operator") return chooseOperator(key.label);
      if (key.action === "equals") return equals();
      if (key.action === "clear") return clear();
      if (display === "Error") return clear();
      if (key.action === "sign" && display !== "0")
        setDisplay(tidyNumber(Number(display) * -1));
      if (key.action === "percent")
        setDisplay(tidyNumber(Number(display) / 100));
    },
    [chooseOperator, clear, display, equals, inputDigit],
  );

  const backspace = useCallback(() => {
    if (waitingForOperand || display === "Error") return;
    setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
  }, [display, waitingForOperand]);

  useEffect(() => {
    if (!keyboardEnabled) return undefined;

    const onKeyDown = (event) => {
      const key = event.key;
      if (/^[0-9.]$/.test(key)) inputDigit(key);
      else if (key === "+") chooseOperator("+");
      else if (key === "-") chooseOperator("−");
      else if (key === "*") chooseOperator("×");
      else if (key === "/") chooseOperator("÷");
      else if (key === "Enter" || key === "=") equals();
      else if (key === "Escape") clear();
      else if (key === "Backspace") backspace();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    backspace,
    chooseOperator,
    clear,
    equals,
    inputDigit,
    keyboardEnabled,
  ]);

  return {
    backspace,
    clearHistory: () => setHistory([]),
    copyResult,
    copyStatus,
    display,
    expression,
    handleAction,
    handleMemoryAction,
    hasMemory,
    history,
    isHistoryOpen,
    memory,
    operator,
    reuseHistoryResult,
    shareResult,
    shareStatus,
    toggleHistory: () => setIsHistoryOpen((current) => !current),
    waitingForOperand,
  };
}
