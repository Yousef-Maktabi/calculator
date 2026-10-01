import { Calculator, Ruler } from "lucide-react";

const modes = [
  {
    id: "calculator",
    label: "Calculator",
    icon: <Calculator size={17} strokeWidth={2} />,
  },
  {
    id: "converter",
    label: "Convert",
    icon: <Ruler size={17} strokeWidth={2} />,
  },
];

export default function ModeTabs({ mode, onChange }) {
  return (
    <div
      className="mb-3 grid grid-cols-2 gap-2 rounded-2xl bg-[#5e1738] p-1.5"
      role="tablist"
      aria-label="Tool mode"
    >
      {modes.map(({ id, label, icon }) => {
        const isActive = mode === id;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
              isActive
                ? "bg-[#ffe7ee] text-[#741c45] shadow-sm"
                : "text-[#ffd5e2] hover:bg-white/10"
            }`}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}
