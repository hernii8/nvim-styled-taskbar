import { exec, execAsync } from "ags/process";
import { Command, SubItem } from "./registry";

interface WifiNetwork {
  ssid: string
  signal: number
  security: string
  active: boolean
}

function signalIcon(signal: number): string {
  if (signal > 75) return "󰤨";
  if (signal > 50) return "󰤥";
  if (signal > 25) return "󰤢";
  return "󰤟";
}

function parseSignal(rawLine: string): number {
  const starRegex = /(\x1B\[[0-9;]*m)?(\*+)/g;
  let match: RegExpExecArray | null;
  let signalBars = 0;

  while ((match = starRegex.exec(rawLine)) !== null) {
    const ansi = match[1] || "";
    const stars = match[2];
    const ANSI_GREY = "[1;90m";
    const isWeakStar = ansi.includes(ANSI_GREY);
    if (!isWeakStar) signalBars += stars.length;
  }
  return signalBars * 25
}


function parseNetworks(output: string): WifiNetwork[] {
  const networks: WifiNetwork[] = [];
  const seen = new Set<string>();

  const lines = output.split("\n").slice(4);

  for (const rawLine of lines) {
    if (!rawLine.includes("*")) continue;

    const ANSI_REGEX = /\x1B\[[0-9;]*m/g;
    const cleanLine = rawLine.replace(ANSI_REGEX, "");

    const parts = cleanLine.split(" ").filter(el => el.trim());
    if (parts.length < 3) continue;

    const active = parts[0] === ">";
    const ssid = active ? parts[1] : parts[0];
    const security = active ? parts[2] : parts[1];
    const signal = parseSignal(rawLine)

    if (!ssid || seen.has(ssid)) continue;
    seen.add(ssid);

    networks.push({ ssid, security, signal, active });
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
      output = exec("iwctl station wlan0 get-networks");
    } catch {
      return [{ id: "error", label: "iwctl not available", icon: "󰖩", action: () => { } }];
    }
    const networks = parseNetworks(output).filter((n) => fuzzyMatch(query, n.ssid));
    return networks.map((n) => ({
      id: n.ssid,
      label: n.ssid,
      icon: signalIcon(n.signal),
      description: n.active ? "connected" : `${n.security}`,
      action: () => {
        execAsync(`iwctl station wlan0 connect "${n.ssid}"`).catch(() => { });
      },
    }));
  },
};

export default wifiCommand;
