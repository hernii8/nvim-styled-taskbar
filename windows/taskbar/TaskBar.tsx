import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { createState, createComputed } from "ags";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";
import Battery from "../../widget/battery/Battery";
import Workspaces from "../../widget/Workspaces";
import Network from "../../widget/network/Network";
import StatusLineDivider from "../../widget/StatusLineDivider";
import Date from "../../widget/Date";
import Bluetooth from "../../widget/bluetooth/Bluetooth";
import SliderWidget from "../../widget/SliderWidget";
import Mode from "./modes/Mode";
import CommandList from "../command-palette/CommandList";
import {
  currentMode,
  sliderTarget,
  setSliderTarget,
  sliderValue,
  setSliderValue,
} from "./modes/modeSwitch";
import CommandPalette from "../command-palette/CommandPalette";

const [volValue, setVolValue] = createState(50);
const [briValue, setBriValue] = createState(50);

async function refreshVol(): Promise<void> {
  try {
    const out = await execAsync("wpctl get-volume @DEFAULT_AUDIO_SINK@");
    const m = out.match(/(\d+\.?\d*)/);
    if (m) setVolValue(Math.round(parseFloat(m[1]) * 100));
  } catch { }
}

async function refreshBri(): Promise<void> {
  try {
    const current = await execAsync("brightnessctl get");
    const max = await execAsync("brightnessctl max");
    const pct = Math.round((parseInt(current.trim()) / parseInt(max.trim())) * 100);
    if (!isNaN(pct)) setBriValue(pct);
  } catch { }
}

function adjustSlider(delta: number) {
  const v = Math.max(0, Math.min(100, sliderValue.get() + delta));
  setSliderValue(v);
  if (sliderTarget.get() === "volume") {
    execAsync(`wpctl set-volume @DEFAULT_AUDIO_SINK@ ${v}%`).catch(() => { });
  } else {
    execAsync(`brightnessctl set ${v}%`).catch(() => { });
  }
}

refreshVol();
refreshBri();
GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
  refreshVol();
  refreshBri();
  return GLib.SOURCE_CONTINUE;
});

export default function TaskBar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const keymode = createComputed(
    [currentMode, sliderTarget],
    (mode, slider) =>
      mode === "command" || slider !== "none"
        ? Astal.Keymode.EXCLUSIVE
        : Astal.Keymode.ON_DEMAND,
  );

  return (
    <window
      keymode={keymode((v) => v)}
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
      onRealize={(self: Astal.Window) => {
        const ctrl = new Gtk.EventControllerKey();
        ctrl.connect(
          "key-pressed",
          (_: Gtk.EventControllerKey, keyval: number): boolean => {
            if (sliderTarget.get() === "none") return false;
            if (keyval === Gdk.KEY_Up || keyval === Gdk.KEY_Right) {
              adjustSlider(+5);
              return true;
            }
            if (keyval === Gdk.KEY_Down || keyval === Gdk.KEY_Left) {
              adjustSlider(-5);
              return true;
            }
            if (keyval === Gdk.KEY_Escape) {
              setSliderTarget("none");
              return true;
            }
            return false;
          },
        );
        self.add_controller(ctrl);
      }}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <centerbox cssName="centerbox">
          <box $type="start" spacing={8} halign={Gtk.Align.START}>
            <Mode />
          </box>

          <box $type="end" spacing={12} halign={Gtk.Align.END}>
            <label
              label={currentMode((v) => (v === "normal" ? "NORMAL" : "COMMAND"))}
              cssName="vim-mode-label"
            />
            <StatusLineDivider />

            <box visible={sliderTarget((t) => t === "none")} spacing={12}>
              <Battery />
              <StatusLineDivider />
              <Date />
              <StatusLineDivider />
              <Network />
              <StatusLineDivider />
              <Bluetooth />
              <Workspaces />
              <StatusLineDivider />
            </box>

            <button
              cssName="vol-btn"
              onClicked={() => {
                refreshVol().then(() => {
                  setSliderValue(volValue.get());
                  setSliderTarget("volume");
                });
              }}
            >
              <label label={volValue((v) => `󰕾 ${v}%`)} />
            </button>
            <button
              cssName="vol-btn"
              onClicked={() => {
                refreshBri().then(() => {
                  setSliderValue(briValue.get());
                  setSliderTarget("brightness");
                });
              }}
            >
              <label label={briValue((v) => `󰃞 ${v}%`)} />
            </button>

            <SliderWidget />
          </box>
        </centerbox>
      </box>
    </window>

  );
}
