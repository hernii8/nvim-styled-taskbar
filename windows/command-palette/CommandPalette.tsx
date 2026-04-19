import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import { currentMode } from "../taskbar/modes/modeSwitch";
import CommandList from "./CommandList";

export default function CommandPalette(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  return (
    <window
      name="command-palette"
      class="CommandPalette"
      visible={currentMode((v) => v === "command")}
      gdkmonitor={gdkmonitor}
      anchor={TOP | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      layer={Astal.Layer.OVERLAY}
      marginTop={30}
      application={app}
    >
      <CommandList />
    </window>
  );
}
