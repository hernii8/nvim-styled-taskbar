import { execAsync } from "ags/process";
import { createState } from "ags";
import { setSliderTarget, sliderTarget } from "../windows/taskbar/modes/modeSwitch";

function bar(v: number): string {
  const n = Math.round(v / 10);
  return `▐${"▓".repeat(n)}${"░".repeat(10 - n)}▌`;
}

const [sliderValue, setSliderValue] = createState(0);
const SLIDER_STEP = 10;

async function refreshVolume(): Promise<void> {
  const out = await execAsync("wpctl get-volume @DEFAULT_AUDIO_SINK@");
  const m = out.match(/(\d+\.?\d*)/);
  if (m) setSliderValue(Math.round(parseFloat(m[1]) * 100));
}

async function refreshBrightness(): Promise<void> {
  const current = await execAsync("brightnessctl get");
  const max = await execAsync("brightnessctl max");
  const pct = Math.round((parseInt(current.trim()) / parseInt(max.trim())) * 100);
  if (!isNaN(pct)) setSliderValue(pct);
}

async function refresh(): Promise<void> {
  await refreshVolume();
  await refreshBrightness();
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export async function adjustSlider(delta: 1 | -1) {
  await refresh();
  const v = Math.max(0, Math.min(100, sliderValue.peek() + (SLIDER_STEP * delta)));
  setSliderValue(v);
  if (sliderTarget.peek() === "volume") {
    execAsync(`wpctl set-volume @DEFAULT_AUDIO_SINK@ ${v}%`).catch(() => { });
  } else {
    execAsync(`brightnessctl set ${v}%`).catch(() => { });
  }
  if (hideTimer !== null) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    hideTimer = null;
    setSliderTarget("none");
  }, 1500);
}

export default function SliderWidget() {
  return (
    <box>
      <label label={sliderTarget((t) => (t === "volume" ? "󰕾" : "󰃞"))} cssName="slider-icon" />
      <label label={sliderTarget((t) => (t === "volume" ? "VOL" : "BRI"))} cssName="slider-name" />
      <label label={sliderValue((v) => `${bar(v)}  ${v}%`)} cssName="slider-bar" />
    </box>
  );
}
