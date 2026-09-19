import { useCallback, useEffect, useState } from "react";
import { Delete as Backspace } from "lucide-react";

const operations = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

const keys = [
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

function tidyNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

function formatDisplay(value) {
  if (value === "Error") return value;
  const [integer, decimal] = value.split(".");
  const formatted = Number(integer).toLocaleString("en-US");
  return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
}

export default function App() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [expression, setExpression] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
  }, []);

  const inputDigit = useCallback(
    (digit) => {
      if (display === "Error" || waitingForOperand) {
        setDisplay(digit === "." ? "0." : digit);
        setWaitingForOperand(false);
        return;
      }
      if (digit === "." && display.includes(".")) return;
      if (display.replace("-", "").length >= 12) return;
      setDisplay((current) =>
        current === "0" && digit !== "." ? digit : current + digit,
      );
    },
    [display, waitingForOperand],
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
    if (operator === null || storedValue === null || display === "Error")
      return;
    const inputValue = Number(display);
    const result = calculate(storedValue, inputValue);
    const nextDisplay = tidyNumber(result);
    setExpression(
      nextDisplay === "Error"
        ? "Cannot divide by zero"
        : `${formatDisplay(String(storedValue))} ${operator} ${formatDisplay(display)} =`,
    );
    setDisplay(nextDisplay);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [calculate, display, operator, storedValue]);

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
  }, [backspace, chooseOperator, clear, equals, inputDigit]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f25582] px-5 py-10 font-sans text-[#4a1830]">
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[#ff9bb7]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-[#c93067]/35 blur-3xl" />

      <div className="relative w-full max-w-[390px]">
        <h1 className="mb-6 text-center text-2xl font-bold leading-tight tracking-[-0.025em] text-white drop-shadow-sm">
          A pink calculator for Dr. Arghavan,
          <span className="mt-1 block text-sm font-medium tracking-normal text-[#ffe0e9]">
            as we discussed :)
          </span>
        </h1>

        <section
          className="rounded-[2.25rem] border border-white/20 bg-[#741c45] p-3 shadow-[0_28px_70px_rgba(91,15,52,0.38)]"
          aria-label="Calculator"
        >
          <div className="overflow-hidden rounded-[1.65rem] bg-[#ffe7ee]">
            <div className="flex min-h-52 flex-col justify-end px-7 pb-6 pt-8 text-right">
              <div className="mb-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={backspace}
                  className="grid size-9 place-items-center rounded-full text-[#ad4168] transition hover:bg-white/70 active:scale-95"
                  aria-label="Delete last digit"
                >
                  <Backspace size={19} strokeWidth={1.8} />
                </button>
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

            <div className="grid grid-cols-4 gap-2.5 rounded-t-[1.75rem] bg-[#8e2351] p-4">
              {keys.map((key) => (
                <button
                  key={key.label}
                  type="button"
                  onClick={() => handleAction(key)}
                  className={[
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
                    operator === key.label && waitingForOperand
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#8e2351]"
                      : "",
                  ].join(" ")}
                  aria-label={key.label === "AC" ? "Clear all" : key.label}
                >
                  {key.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
