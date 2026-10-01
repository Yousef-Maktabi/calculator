export const operations = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

export const calculatorKeys = [
  { label: "AC", type: "utility", action: "clear" },
  { label: "+/−", type: "utility", action: "sign" },
  { label: "%", type: "utility", action: "percent" },
  { label: "÷", type: "operator", action: "operator" },
  { label: "7", type: "number" },
  { label: "8", type: "number" },
  { label: "9", type: "number" },
  { label: "×", type: "operator", action: "operator" },
  { label: "4", type: "number" },
  { label: "5", type: "number" },
  { label: "6", type: "number" },
  { label: "−", type: "operator", action: "operator" },
  { label: "1", type: "number" },
  { label: "2", type: "number" },
  { label: "3", type: "number" },
  { label: "+", type: "operator", action: "operator" },
  { label: "0", type: "number", wide: true },
  { label: ".", type: "number" },
  { label: "=", type: "equals", action: "equals" },
];

export const memoryKeys = [
  { label: "MC", action: "clear", ariaLabel: "Clear memory" },
  { label: "MR", action: "recall", ariaLabel: "Recall memory" },
  { label: "M+", action: "add", ariaLabel: "Add displayed value to memory" },
  {
    label: "M−",
    action: "subtract",
    ariaLabel: "Subtract displayed value from memory",
  },
];

export const HISTORY_STORAGE_KEY = "pink-calculator-history";
