import { execAsync } from "ags/process";
import { Command, SubItem } from "./registry";

interface BtDevice {
  mac: string
  name: string
}

function parseDevices(output: string): BtDevice[] {
  return output
    .split("\n")
    .filter((line) => line.startsWith("Device "))
    .map((line) => {
      const parts = line.split(" ");
      const mac = parts[1];
      const name = parts.slice(2).join(" ");
      return { mac, name };
    });
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
      output = await execAsync("bluetoothctl devices Paired");
    } catch {
      return [{ id: "error", label: "bluetoothctl not available", icon: "󰂱", action: () => {} }];
    }
    let connectedInfo = "";
    try { connectedInfo = await execAsync("bluetoothctl info"); } catch {}
    const connectedMac = connectedInfo.match(/Device ([A-Fa-f0-9:]{17})/)?.[1] ?? null;

    const devices = parseDevices(output).filter((d) => fuzzyMatch(query, d.name));
    return devices.map((d) => {
      const isConnected = d.mac === connectedMac;
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
