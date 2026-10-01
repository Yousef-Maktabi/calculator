import { useState } from "react";
import Calculator from "./components/Calculator";
import ModeTabs from "./components/ModeTabs";
import UnitConverter from "./UnitConverter";

export default function App() {
  const [mode, setMode] = useState("calculator");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f25582] px-5 py-10 font-sans text-[#4a1830]">
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[#ff9bb7]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-[#c93067]/35 blur-3xl" />

      <div className="relative w-full max-w-[390px]">
        <h1 className="mb-6 text-center text-2xl font-bold leading-tight tracking-[-0.025em] text-white drop-shadow-sm">
          A pink calculator for Dr. Arghavan,
          <span className="mt-1 block text-sm font-medium tracking-normal text-[#ffe0e9]">
            as I promised :)
          </span>
        </h1>

        <section
          className="rounded-[2.25rem] border border-white/20 bg-[#741c45] p-3 shadow-[0_28px_70px_rgba(91,15,52,0.38)]"
          aria-label={mode === "calculator" ? "Calculator" : "Unit converter"}
        >
          <ModeTabs mode={mode} onChange={setMode} />
          <div className={mode === "calculator" ? "" : "hidden"}>
            <Calculator isActive={mode === "calculator"} />
          </div>
          {mode === "converter" && <UnitConverter />}
        </section>
      </div>
    </main>
  );
}
