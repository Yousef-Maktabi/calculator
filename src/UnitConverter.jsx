import { useMemo, useState } from "react";
import { ArrowDownUp, Check, Copy } from "lucide-react";

const categories = {
  length: {
    label: "Length",
    units: [
      { id: "millimeter", label: "Millimeters", symbol: "mm", factor: 0.001 },
      { id: "centimeter", label: "Centimeters", symbol: "cm", factor: 0.01 },
      { id: "meter", label: "Meters", symbol: "m", factor: 1 },
      { id: "kilometer", label: "Kilometers", symbol: "km", factor: 1000 },
      { id: "inch", label: "Inches", symbol: "in", factor: 0.0254 },
      { id: "foot", label: "Feet", symbol: "ft", factor: 0.3048 },
      { id: "yard", label: "Yards", symbol: "yd", factor: 0.9144 },
      { id: "mile", label: "Miles", symbol: "mi", factor: 1609.344 },
    ],
  },
  mass: {
    label: "Mass",
    units: [
      { id: "milligram", label: "Milligrams", symbol: "mg", factor: 0.000001 },
      { id: "gram", label: "Grams", symbol: "g", factor: 0.001 },
      { id: "kilogram", label: "Kilograms", symbol: "kg", factor: 1 },
      { id: "ounce", label: "Ounces", symbol: "oz", factor: 0.028349523125 },
      { id: "pound", label: "Pounds", symbol: "lb", factor: 0.45359237 },
      { id: "stone", label: "Stone", symbol: "st", factor: 6.35029318 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      {
        id: "celsius",
        label: "Celsius",
        symbol: "°C",
        toBase: (value) => value,
        fromBase: (value) => value,
      },
      {
        id: "fahrenheit",
        label: "Fahrenheit",
        symbol: "°F",
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      {
        id: "kelvin",
        label: "Kelvin",
        symbol: "K",
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
    ],
  },
  area: {
    label: "Area",
    units: [
      { id: "square-meter", label: "Square meters", symbol: "m²", factor: 1 },
      { id: "square-kilometer", label: "Square kilometers", symbol: "km²", factor: 1000000 },
      { id: "square-foot", label: "Square feet", symbol: "ft²", factor: 0.09290304 },
      { id: "square-yard", label: "Square yards", symbol: "yd²", factor: 0.83612736 },
      { id: "acre", label: "Acres", symbol: "ac", factor: 4046.8564224 },
      { id: "hectare", label: "Hectares", symbol: "ha", factor: 10000 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "milliliter", label: "Milliliters", symbol: "mL", factor: 0.001 },
      { id: "liter", label: "Liters", symbol: "L", factor: 1 },
      { id: "cubic-meter", label: "Cubic meters", symbol: "m³", factor: 1000 },
      { id: "teaspoon", label: "Teaspoons (US)", symbol: "tsp", factor: 0.00492892159375 },
      { id: "tablespoon", label: "Tablespoons (US)", symbol: "tbsp", factor: 0.01478676478125 },
      { id: "cup", label: "Cups (US)", symbol: "cup", factor: 0.2365882365 },
      { id: "gallon", label: "Gallons (US)", symbol: "gal", factor: 3.785411784 },
    ],
  },
  time: {
    label: "Time",
    units: [
      { id: "millisecond", label: "Milliseconds", symbol: "ms", factor: 0.001 },
      { id: "second", label: "Seconds", symbol: "s", factor: 1 },
      { id: "minute", label: "Minutes", symbol: "min", factor: 60 },
      { id: "hour", label: "Hours", symbol: "hr", factor: 3600 },
      { id: "day", label: "Days", symbol: "day", factor: 86400 },
      { id: "week", label: "Weeks", symbol: "wk", factor: 604800 },
    ],
  },
};

function convert(value, fromUnit, toUnit) {
  const baseValue = fromUnit.toBase
    ? fromUnit.toBase(value)
    : value * fromUnit.factor;
  return toUnit.fromBase
    ? toUnit.fromBase(baseValue)
    : baseValue / toUnit.factor;
}

function formatConvertedValue(value) {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= 1e12 || magnitude < 1e-8) {
    return value.toExponential(8).replace(/\.0+(?=e)/, "");
  }

  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 12,
    useGrouping: true,
  }).format(value);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
  } finally {
    textArea.remove();
  }
}

export default function UnitConverter() {
  const [categoryId, setCategoryId] = useState("length");
  const [fromUnitId, setFromUnitId] = useState("meter");
  const [toUnitId, setToUnitId] = useState("foot");
  const [input, setInput] = useState("1");
  const [copied, setCopied] = useState(false);

  const category = categories[categoryId];
  const fromUnit = category.units.find((unit) => unit.id === fromUnitId);
  const toUnit = category.units.find((unit) => unit.id === toUnitId);
  const numericInput = input.trim() === "" ? null : Number(input);
  const result = useMemo(
    () =>
      numericInput === null || !Number.isFinite(numericInput)
        ? null
        : convert(numericInput, fromUnit, toUnit),
    [fromUnit, numericInput, toUnit],
  );
  const formattedResult = result === null ? "—" : formatConvertedValue(result);

  const changeCategory = (nextCategoryId) => {
    const units = categories[nextCategoryId].units;
    setCategoryId(nextCategoryId);
    setFromUnitId(units[0].id);
    setToUnitId(units[1].id);
    setCopied(false);
  };

  const swapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    if (result !== null) setInput(String(Number(result.toPrecision(12))));
    setCopied(false);
  };

  const copyResult = async () => {
    if (result === null) return;
    try {
      await copyText(`${formattedResult} ${toUnit.symbol}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-[1.65rem] bg-[#ffe7ee]">
      <div className="px-5 pb-6 pt-7">
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#a75c77]" htmlFor="conversion-category">
          Measurement
        </label>
        <select
          id="conversion-category"
          value={categoryId}
          onChange={(event) => changeCategory(event.target.value)}
          className="w-full rounded-2xl border border-[#eeb7c8] bg-white/70 px-4 py-3 text-base font-bold text-[#641d3a] outline-none transition focus:border-[#ad4168] focus:ring-2 focus:ring-[#f4a7bf]"
        >
          {Object.entries(categories).map(([id, item]) => (
            <option key={id} value={id}>{item.label}</option>
          ))}
        </select>

        <div className="mt-5 rounded-2xl bg-white/65 p-4">
          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#a75c77]" htmlFor="from-value">
            From
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="from-value"
              type="number"
              inputMode="decimal"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setCopied(false);
              }}
              placeholder="Enter a value"
              className="min-w-0 flex-1 bg-transparent text-3xl font-semibold tracking-[-0.04em] text-[#54142f] outline-none placeholder:text-base placeholder:font-medium placeholder:tracking-normal placeholder:text-[#bc8298]"
            />
            <select
              value={fromUnitId}
              onChange={(event) => {
                setFromUnitId(event.target.value);
                setCopied(false);
              }}
              aria-label="Convert from unit"
              className="max-w-36 rounded-xl border border-[#ecc0ce] bg-[#ffe7ee] px-3 py-2 font-bold text-[#762044] outline-none focus:ring-2 focus:ring-[#f4a7bf]"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative flex h-10 items-center justify-center">
          <div className="absolute h-px w-full bg-[#eeb7c8]" />
          <button
            type="button"
            onClick={swapUnits}
            className="relative grid size-10 place-items-center rounded-full bg-[#ad4168] text-white shadow-md transition hover:bg-[#982f5b] active:scale-95"
            aria-label="Swap units"
          >
            <ArrowDownUp size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="rounded-2xl bg-[#fbd6e1] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#a75c77]">To</span>
            <button
              type="button"
              onClick={copyResult}
              disabled={result === null}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-[#ad4168] transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Copy converted result"
            >
              {copied ? <Check size={15} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <output className="min-w-0 flex-1 truncate text-3xl font-semibold tracking-[-0.04em] text-[#54142f]" aria-live="polite">
              {formattedResult}
            </output>
            <select
              value={toUnitId}
              onChange={(event) => {
                setToUnitId(event.target.value);
                setCopied(false);
              }}
              aria-label="Convert to unit"
              className="max-w-36 rounded-xl border border-[#ecc0ce] bg-[#ffe7ee] px-3 py-2 font-bold text-[#762044] outline-none focus:ring-2 focus:ring-[#f4a7bf]"
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.label}</option>
              ))}
            </select>
          </div>
          <p className="mt-3 truncate text-sm font-medium text-[#a7667e]">
            {numericInput !== null && Number.isFinite(numericInput)
              ? `${input || 0} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`
              : "Enter a number to convert"}
          </p>
        </div>
      </div>
    </div>
  );
}
