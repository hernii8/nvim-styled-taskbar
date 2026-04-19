import GLib from "gi://GLib";
import { Gtk, Gdk } from "ags/gtk4";
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

export default function CommandMode() {
  let entryRef: Gtk.Entry | null = null;

  return (
    <box
      onMap={() => {
        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
          entryRef?.set_text("");
          entryRef?.grab_focus();
          return GLib.SOURCE_REMOVE;
        });
      }}
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

          const keyCtrl = new Gtk.EventControllerKey();
          keyCtrl.connect(
            "key-pressed",
            (_c, keyval) => {
              if (keyval === Gdk.KEY_Escape) {
                if (commandLevel.peek() === "subpicker") {
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

              if (keyval === Gdk.KEY_ISO_Left_Tab) {
                let nextIndex = selectedIndex.peek() - 1
                if (nextIndex < 0) nextIndex = 3;
                setSelectedIndex(nextIndex);
                return true;
              }

              if (keyval === Gdk.KEY_Tab) {
                let nextIndex = selectedIndex.peek() + 1
                if (nextIndex > 3) nextIndex = 0;
                setSelectedIndex(nextIndex);
                return true;
              }

              return false;
            },
          );
          self.add_controller(keyCtrl);
          self.connect("activate", () => {
            executeSelected();
          });

          const focusCtrl = new Gtk.EventControllerFocus();

          focusCtrl.connect("leave", () => {
            setMode("normal");
            resetCommandState();
          });

          self.add_controller(focusCtrl);
        }}
        cssName="command-entry"
        placeholderText="type command..."
        onNotifyText={({ text }) => {
          setCommandQuery(text);
          setSelectedIndex(0);
        }}
      />
    </box>
  );
}
