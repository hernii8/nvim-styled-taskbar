import { createState } from "ags";

export const [currentMode, setMode] = createState<"normal" | "command">("normal");
export const [commandQuery, setCommandQuery] = createState("");
export const [commandLevel, setCommandLevel] = createState<"commands" | "subpicker">("commands");
export const [activeCommand, setActiveCommand] = createState<string | null>(null);

// Backward-compat alias used by NormalMode.tsx
export const modeSwitch = currentMode;

export function resetCommandState() {
  setCommandQuery("");
  setCommandLevel("commands");
  setActiveCommand(null);
}
