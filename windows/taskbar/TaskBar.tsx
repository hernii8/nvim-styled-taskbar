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
import {
  currentMode,
  sliderTarget,
} from "./modes/modeSwitch";
import Logo from "../../widget/Logo";

export default function TaskBar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const keymode = createComputed(
    [currentMode],
    (mode) =>
      mode === "command"
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
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <centerbox cssName="centerbox">
          <box $type="start" spacing={8} halign={Gtk.Align.START}>
            <Logo />
            <StatusLineDivider />
            <Mode />
          </box>

          <box $type="end" spacing={12} halign={Gtk.Align.END}>

            <box visible={sliderTarget((t) => t === "none")} spacing={12}>
              <Battery />
              <StatusLineDivider />
              <Date />
              <StatusLineDivider />
              <Network />
              <StatusLineDivider />
              <Bluetooth />
              <Workspaces />
            </box>

            <box visible={sliderTarget((t) => t !== "none")} spacing={8} valign={Gtk.Align.CENTER}>
              <SliderWidget />
            </box>
          </box>
        </centerbox>
      </box>
    </window>

  );
}
