import { createComputed } from "ags";
import { Gtk, Gdk } from "ags/gtk4";
import {
  currentMode,
  setMode,
  commandLevel,
  setCommandLevel,
  setCommandQuery,
  setActiveCommand,
  resetCommandState,
} from "./modeSwitch";

export default function CommandInput() {
  let entryRef: Gtk.Entry | null = null;

  // Clear and focus the entry whenever command mode activates OR when returning
  // from a sub-picker back to the command list (commandLevel dep handles that).
  createComputed([currentMode, commandLevel], (mode) => {
    if (mode === "command" && entryRef) {
      entryRef.set_text("");
      entryRef.grab_focus();
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

          // GTK4 key events require an EventControllerKey — there is no onKeyPressed
          // prop directly on GtkEntry in GTK4.
          const ctrl = new Gtk.EventControllerKey();
          ctrl.connect(
            "key-pressed",
            (_c: Gtk.EventControllerKey, keyval: number): boolean => {
              if (keyval === Gdk.KEY_Escape) {
                if (commandLevel.get() === "subpicker") {
                  setCommandLevel("commands");
                  setCommandQuery("");
                  setActiveCommand(null);
                } else {
                  setMode("normal");
                  resetCommandState();
                }
                return true;
              }
              return false;
            },
          );
          self.add_controller(ctrl);
        }}
        cssName="command-entry"
        placeholderText="type command..."
        onNotifyText={({ text }) => setCommandQuery(text)}
      />
      <label label="-- COMMAND --" cssName="mode-indicator" />
    </box>
  );
}
