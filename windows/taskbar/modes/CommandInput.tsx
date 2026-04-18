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

  // Grab focus and clear the entry whenever command mode activates
  currentMode((mode) => {
    if (mode === "command" && entryRef) {
      entryRef.set_text("");
      entryRef.grab_focus();
    }
  });

  // Update prefix label when drilling into a sub-picker
  function onKeyPressed(
    _e: Gtk.EventControllerKey,
    keyval: number,
    _keycode: number,
    _mod: Gdk.ModifierType,
  ) {
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
  }

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
        setup={(self) => { entryRef = self; }}
        cssName="command-entry"
        placeholderText="type command..."
        onNotifyText={({ text }) => setCommandQuery(text)}
        onKeyPressed={onKeyPressed}
      />
      <label label="-- COMMAND --" cssName="mode-indicator" />
    </box>
  );
}
