import { Gtk } from "ags/gtk4";
import { sliderTarget, sliderValue } from "../windows/taskbar/modes/modeSwitch";

function bar(v: number): string {
  const n = Math.round(v / 10);
  return `▐${"▓".repeat(n)}${"░".repeat(10 - n)}▌`;
}

export default function SliderWidget() {
  return (
    <box visible={sliderTarget((t) => t !== "none")} spacing={8} valign={Gtk.Align.CENTER}>
      <label label={sliderTarget((t) => (t === "volume" ? "󰕾" : "󰃞"))} cssName="slider-icon" />
      <label label={sliderTarget((t) => (t === "volume" ? "VOL" : "BRI"))} cssName="slider-name" />
      <label label={sliderValue((v) => `${bar(v)}  ${v}%`)} cssName="slider-bar" />
      <label label="esc to close" cssName="item-desc" />
    </box>
  );
}
