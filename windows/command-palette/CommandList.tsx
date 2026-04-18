import { createState, For } from "ags";
import { Gtk } from "ags/gtk4";
import {
  commandQuery,
  commandLevel,
  setCommandLevel,
  activeCommand,
  setActiveCommand,
  setCommandQuery,
  setMode,
  resetCommandState,
} from "../taskbar/modes/modeSwitch";
import { Command, SubItem } from "../../commands/registry";
import appsCommand from "../../commands/apps";
import bluetoothCommand from "../../commands/bluetooth";
import wifiCommand from "../../commands/wifi";
import volumeCommand from "../../commands/volume";
import brightnessCommand from "../../commands/brightness";
import directoriesCommand from "../../commands/directories";

const commands: Command[] = [
  appsCommand,
  bluetoothCommand,
  wifiCommand,
  volumeCommand,
  brightnessCommand,
  directoriesCommand,
];

function fuzzyFilterCommands(query: string): Command[] {
  if (!query) return commands;
  const q = query.toLowerCase();
  return commands.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q),
  );
}

async function fetchSubItems(cmdId: string | null, query: string): Promise<SubItem[]> {
  const cmd = commands.find((c) => c.id === cmdId);
  if (!cmd) return [];
  const result = cmd.getItems(query);
  return result instanceof Promise ? result : Promise.resolve(result);
}

export default function CommandList() {
  const [subItems, setSubItems] = createState<SubItem[]>([]);

  // When the level becomes "subpicker", load items for the selected command.
  // Re-fetch whenever the query changes at subpicker level.
  // We subscribe imperatively via the signal callback form.
  commandLevel((level) => {
    if (level === "subpicker") {
      fetchSubItems(activeCommand.get(), commandQuery.get()).then(setSubItems);
    } else {
      setSubItems([]);
    }
  });

  commandQuery((query) => {
    if (commandLevel.get() === "subpicker") {
      fetchSubItems(activeCommand.get(), query).then(setSubItems);
    }
  });

  function selectCommand(cmd: Command) {
    setActiveCommand(cmd.id);
    setCommandLevel("subpicker");
    setCommandQuery("");
    setSubItems([]);
    fetchSubItems(cmd.id, "").then(setSubItems);
  }

  function executeItem(item: SubItem) {
    item.action();
    setMode("normal");
    resetCommandState();
  }

  return (
    <box orientation={Gtk.Orientation.VERTICAL} cssName="command-list">

      {/* Level 1: command categories */}
      <box
        orientation={Gtk.Orientation.VERTICAL}
        visible={commandLevel((l) => l === "commands")}
      >
        <For each={commandQuery((q) => fuzzyFilterCommands(q))}>
          {(cmd) => (
            <button
              class="list-item"
              onClicked={() => selectCommand(cmd)}
            >
              <box spacing={8}>
                <label label={cmd.icon} cssName="item-icon" />
                <label label={cmd.name} xalign={0} />
                <label
                  label={cmd.description}
                  cssName="item-desc"
                  hexpand
                  halign={Gtk.Align.END}
                  xalign={1}
                />
                <label label="↵" cssName="item-hint" />
              </box>
            </button>
          )}
        </For>
      </box>

      {/* Level 2: sub-items */}
      <box
        orientation={Gtk.Orientation.VERTICAL}
        visible={commandLevel((l) => l === "subpicker")}
      >
        <For each={subItems}>
          {(item) => (
            <button
              class="list-item"
              onClicked={() => executeItem(item)}
            >
              <box spacing={8}>
                <label label={item.icon} cssName="item-icon" />
                <label label={item.label} xalign={0} />
                <label
                  label={item.description ?? ""}
                  cssName="item-desc"
                  hexpand
                  halign={Gtk.Align.END}
                  xalign={1}
                />
              </box>
            </button>
          )}
        </For>
        <label
          visible={subItems((i) => i.length === 0)}
          label="No results"
          cssName="item-desc"
          halign={Gtk.Align.CENTER}
        />
      </box>

    </box>
  );
}
