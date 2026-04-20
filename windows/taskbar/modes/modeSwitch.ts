import { createState } from "ags";

export const [currentMode, setMode] = createState<"normal" | "command">("normal");
export const [commandQuery, setCommandQuery] = createState("");
export const [commandLevel, setCommandLevel] = createState<"commands" | "subpicker">("commands");
export const [activeCommand, setActiveCommand] = createState<string | null>(null);
export const [selectedIndex, setSelectedIndex] = createState(0);

export type SliderTarget = "none" | "volume" | "brightness";
export const [sliderTarget, setSliderTarget] = createState<SliderTarget>("none");

// Backward-compat alias used by NormalMode.tsx
export const modeSwitch = currentMode;

export function resetCommandState() {
  setCommandQuery("");
  setCommandLevel("commands");
  setActiveCommand(null);
  setSelectedIndex(0);
}

// Set by CommandList so the entry's key handler can trigger execution without
// importing the command list directly (avoids circular deps).
let _executeSelected: (() => void) | null = null;
export function registerExecuteHandler(fn: () => void) { _executeSelected = fn; }
export function executeSelected() { _executeSelected?.(); }
