import { createState, createComputed, For } from "ags";
import { Gtk } from "ags/gtk4";
import {
  commandQuery,
  commandLevel,
  setCommandLevel,
  activeCommand,
  setActiveCommand,
  setCommandQuery,
  setMode,
  selectedIndex,
  setSelectedIndex,
  resetCommandState,
  registerExecuteHandler,
} from "../taskbar/modes/modeSwitch";
import { Command, SubItem } from "../../commands/registry";
import appsCommand from "../../commands/apps";
import bluetoothCommand from "../../commands/bluetooth";
import wifiCommand from "../../commands/wifi";
import directoriesCommand from "../../commands/directories";

const commands: Command[] = [
  appsCommand,
  bluetoothCommand,
  wifiCommand,
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

function fuzzyFilterSubItems(query: string, items: SubItem[]): SubItem[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(
    (i) =>
      i.label.toLowerCase().includes(q) ||
      (i.description ?? "").toLowerCase().includes(q),
  );
}

export default function CommandList() {
  // allSubItems holds the full unfiltered list for the current command.
  // Fetched explicitly when a command is selected.
  const [allSubItems, setAllSubItems] = createState<SubItem[]>([]);

  // Derived filtered lists — createComputed is used as intended here
  // (returns a derived signal consumed by <For each={...}>).
  const filteredCommands = createComputed(
    [commandQuery],
    (q) => fuzzyFilterCommands(q),
  );

  const filteredSubItems = createComputed(
    [commandQuery, allSubItems],
    (q, items) => fuzzyFilterSubItems(q, items),
  );

  function selectCommand(cmd: Command) {
    setAllSubItems([]);
    setSelectedIndex(0);
    setActiveCommand(cmd.id);
    setCommandLevel("subpicker");
    setCommandQuery("");
    // Explicit fetch — no reactive side-effect needed
    const result = cmd.getItems("");
    if (result instanceof Promise) {
      result.then(setAllSubItems);
    } else {
      setAllSubItems(result);
    }
  }

  function executeItem(item: SubItem) {
    item.action();
    setMode("normal");
    resetCommandState();
  }

  registerExecuteHandler(() => {
    const si = selectedIndex.peek();
    if (commandLevel.peek() === "commands") {
      const cmds = fuzzyFilterCommands(commandQuery.peek());
      if (si < cmds.length) selectCommand(cmds[si]);
    } else {
      const items = fuzzyFilterSubItems(commandQuery.peek(), allSubItems.peek());
      if (si < items.length) executeItem(items[si]);
    }
  });

  return (
    <box orientation={Gtk.Orientation.VERTICAL} cssName="command-list">

      <box
        orientation={Gtk.Orientation.VERTICAL}
        visible={commandLevel((l) => l === "commands")}
      >
        <For each={filteredCommands}>
          {(cmd, index) => {
            const isSelected = createComputed(
              [selectedIndex, index],
              (si, i) => si === i,
            );
            return (
              <button class="list-item" onClicked={() => selectCommand(cmd)}>
                <box spacing={8}>
                  <label label={isSelected((v) => (v ? "▶" : " "))} cssName="item-hint" />
                  <label label={cmd.icon} cssName="item-icon" />
                  <label label={cmd.name} xalign={0} />
                  <label
                    label={cmd.description}
                    cssName="item-desc"
                    hexpand
                    halign={Gtk.Align.END}
                    xalign={1}
                  />
                </box>
              </button>
            );
          }}
        </For>
      </box>

      <box
        orientation={Gtk.Orientation.VERTICAL}
        visible={commandLevel((l) => l === "subpicker")}
      >
        <For each={filteredSubItems}>
          {(item, index) => {
            const isSelected = createComputed(
              [selectedIndex, index],
              (si, i) => si === i,
            );
            return (
              <button class="list-item" onClicked={() => executeItem(item)}>
                <box spacing={8}>
                  <label label={isSelected((v) => (v ? "▶" : " "))} cssName="item-hint" />
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
            );
          }}
        </For>
        <label
          visible={filteredSubItems((i) => i.length === 0)}
          label="loading..."
          cssName="item-desc"
          halign={Gtk.Align.CENTER}
        />
      </box>

    </box>
  );
}
