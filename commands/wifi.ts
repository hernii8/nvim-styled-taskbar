import { exec, execAsync } from "ags/process";
import { Command, SubItem } from "./registry";

interface WifiNetwork {
  ssid: string
  signal: number
  security: string
  active: boolean
}

function signalIcon(signal: number): string {
  if (signal >= 75) return "󰤨";
  if (signal >= 50) return "󰤥";
  if (signal >= 25) return "󰤢";
  return "󰤟";
}

function parseNetworks(output: string): WifiNetwork[] {
  const networks: WifiNetwork[] = [];
  const seen = new Set<string>();
  for (const line of output.split("\n")) {
    // nmcli -t -f IN-USE,SSID,SIGNAL,SECURITY
    const parts = line.split(":");
    if (parts.length < 4) continue;
    const active = parts[0].trim() === "*";
    const ssid = parts[1].trim();
    const signal = parseInt(parts[2]) || 0;
    const security = parts[3].trim();
    if (!ssid || seen.has(ssid)) continue;
    seen.add(ssid);
    networks.push({ ssid, signal, security, active });
  }
  return networks.sort((a, b) => b.signal - a.signal);
}

function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}

const wifiCommand: Command = {
  id: "wifi",
  name: "WiFi",
  icon: "󰖩",
  description: "Select a WiFi network",
  async getItems(query: string): Promise<SubItem[]> {
    let output = "";
    try {
      output = exec("nmcli -t -f IN-USE,SSID,SIGNAL,SECURITY device wifi list");
    } catch {
      return [{ id: "error", label: "nmcli not available", icon: "󰖩", action: () => {} }];
    }
    const networks = parseNetworks(output).filter((n) => fuzzyMatch(query, n.ssid));
    return networks.map((n) => ({
      id: n.ssid,
      label: n.ssid,
      icon: signalIcon(n.signal),
      description: n.active ? "connected" : `${n.signal}% ${n.security}`,
      action: () => {
        execAsync(`nmcli device wifi connect "${n.ssid}"`).catch(() => {});
      },
    }));
  },
};

export default wifiCommand;
