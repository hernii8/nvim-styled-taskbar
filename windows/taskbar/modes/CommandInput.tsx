import { createComputed } from "ags";
import { Gtk, Gdk } from "ags/gtk4";
import GLib from "gi://GLib";
import {
  currentMode,
  setMode,
  commandLevel,
  setCommandLevel,
  setCommandQuery,
  setActiveCommand,
  setSelectedIndex,
  selectedIndex,
  resetCommandState,
  executeSelected,
} from "./modeSwitch";

export default function CommandInput() {
  let entryRef: Gtk.Entry | null = null;

  // Defer grab_focus via GLib.idle_add so the widget is fully visible before
  // we try to focus it. Fires whenever mode or level changes.
  createComputed([currentMode, commandLevel], (mode) => {
    if (mode === "command" && entryRef) {
      GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        entryRef?.set_text("");
        entryRef?.grab_focus();
        return GLib.SOURCE_REMOVE;
      });
    }
    return mode;
  });

  return (
    <box
      visible={currentMode((v) => v === "command")}
      spacing={4}
      valign={Gtk.Align.CENTER}
    >
      <label
        label={commandLevel((l) => (l === "subpicker" ? "  /" : ":"))}
        cssName="command-prefix"
      />
      <entry
        onRealize={(self: Gtk.Entry) => {
          entryRef = self;

          const ctrl = new Gtk.EventControllerKey();
          ctrl.connect(
            "key-pressed",
            (_c: Gtk.EventControllerKey, keyval: number): boolean => {
              if (keyval === Gdk.KEY_Escape) {
                if (commandLevel.get() === "subpicker") {
                  setCommandLevel("commands");
                  setCommandQuery("");
                  setActiveCommand(null);
                  setSelectedIndex(0);
                } else {
                  setMode("normal");
                  resetCommandState();
                }
                return true;
              }
              if (keyval === Gdk.KEY_Up) {
                setSelectedIndex(Math.max(0, selectedIndex.get() - 1));
                return true;
              }
              if (keyval === Gdk.KEY_Down) {
                setSelectedIndex(selectedIndex.get() + 1);
                return true;
              }
              if (keyval === Gdk.KEY_Return) {
                executeSelected();
                return true;
              }
              return false;
            },
          );
          self.add_controller(ctrl);
        }}
        cssName="command-entry"
        placeholderText="type command..."
        onNotifyText={({ text }) => {
          setCommandQuery(text);
          setSelectedIndex(0); // reset cursor when query changes
        }}
      />
      <label label="-- COMMAND --" cssName="mode-indicator" />
    </box>
  );
}
