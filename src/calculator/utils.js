import { HISTORY_STORAGE_KEY } from "./config";

export function loadHistory() {
  try {
    const savedHistory = JSON.parse(
      window.localStorage.getItem(HISTORY_STORAGE_KEY) ?? "[]",
    );

    if (!Array.isArray(savedHistory)) return [];

    return savedHistory
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.expression === "string" &&
          typeof item.result === "string",
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function writeToClipboard(value) {
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
    if (!document.execCommand("copy")) throw new Error("Copy failed");
  } finally {
    textArea.remove();
  }
}

export function tidyNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

export function formatDisplay(value) {
  if (value === "Error") return value;
  const [integer, decimal] = value.split(".");
  const formatted = Number(integer).toLocaleString("en-US");
  return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
}
