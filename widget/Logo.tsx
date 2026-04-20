import { currentMode } from "../windows/taskbar/modes/modeSwitch";

export default function Logo() {
  return <label
    label={currentMode((v) => (v === "normal" ? "N" : "C"))}
    cssName="vim-mode-label"
  />
}

