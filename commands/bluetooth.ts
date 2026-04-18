import { exec, execAsync } from "ags/process";
import { Command, SubItem } from "./registry";

interface BtDevice {
  mac: string
  name: string
  connected: boolean
}

function parseDevices(output: string): BtDevice[] {
  return output
    .split("\n")
    .filter((line) => line.startsWith("Device "))
    .map((line) => {
      const parts = line.split(" ");
      const mac = parts[1];
      const name = parts.slice(2).join(" ");
      return { mac, name, connected: false };
    });
}

function getConnectedMacs(): string[] {
  try {
    const info = exec("bluetoothctl info");
    const macMatch = info.match(/Device ([A-Fa-f0-9:]{17})/);
    if (macMatch) return [macMatch[1]];
  } catch {
    // no connected device
  }
  return [];
}

function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return text.toLowerCase().includes(q);
}

const bluetoothCommand: Command = {
  id: "bluetooth",
  name: "Bluetooth",
  icon: "󰂯",
  description: "Select or connect a Bluetooth device",
  async getItems(query: string): Promise<SubItem[]> {
    let output = "";
    try {
      output = exec("bluetoothctl devices Paired");
    } catch {
      return [{ id: "error", label: "bluetoothctl not available", icon: "󰂱", action: () => {} }];
    }
    const connected = getConnectedMacs();
    const devices = parseDevices(output).filter((d) => fuzzyMatch(query, d.name));
    return devices.map((d) => {
      const isConnected = connected.includes(d.mac);
      return {
        id: d.mac,
        label: d.name,
        icon: isConnected ? "󰂱" : "󰂯",
        description: isConnected ? "connected" : d.mac,
        action: () => {
          if (isConnected) {
            execAsync(`bluetoothctl disconnect ${d.mac}`).catch(() => {});
          } else {
            execAsync(`bluetoothctl connect ${d.mac}`).catch(() => {});
          }
        },
      };
    });
  },
};

export default bluetoothCommand;
