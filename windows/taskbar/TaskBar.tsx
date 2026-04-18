import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import Battery from "../../widget/battery/Battery";
import Workspaces from "../../widget/Workspaces";
import Network from "../../widget/network/Network";
import StatusLineDivider from "../../widget/StatusLineDivider";
import Date from "../../widget/Date";
import Bluetooth from "../../widget/bluetooth/Bluetooth";
import Mode from "./modes/Mode";
import CommandList from "../command-palette/CommandList";
import { currentMode } from "./modes/modeSwitch";

export default function TaskBar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  return (
    <window
      keymode={Astal.Keymode.ON_DEMAND}
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
            <Mode />
          </box>

          <box $type="end" spacing={12} halign={Gtk.Align.END}>
            <label
              label={currentMode((v) => (v === "normal" ? "NORMAL" : "COMMAND"))}
              cssName="vim-mode-label"
            />
            <StatusLineDivider />
            <Battery />
            <StatusLineDivider />
            <Date />
            <StatusLineDivider />
            <Network />
            <StatusLineDivider />
            <Bluetooth />
            <Workspaces />
          </box>
        </centerbox>

        {/* Dropdown list — lives in the same window so keyboard events reach it */}
        <box
          visible={currentMode((v) => v === "command")}
          cssName="command-palette-dropdown"
        >
          <CommandList />
        </box>
      </box>
    </window>
  );
}
