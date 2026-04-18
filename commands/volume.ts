import { exec, execAsync } from "ags/process";
import { Command, SubItem } from "./registry";

function getCurrentVolume(): { vol: number; muted: boolean } {
  try {
    const out = exec("wpctl get-volume @DEFAULT_AUDIO_SINK@");
    // "Volume: 0.75" or "Volume: 0.75 [MUTED]"
    const match = out.match(/Volume:\s*([\d.]+)/);
    const vol = match ? Math.round(parseFloat(match[1]) * 100) : 0;
    const muted = out.includes("[MUTED]");
    return { vol, muted };
  } catch {
    return { vol: 0, muted: false };
  }
}

function getMicVolume(): { vol: number; muted: boolean } {
  try {
    const out = exec("wpctl get-volume @DEFAULT_AUDIO_SOURCE@");
    const match = out.match(/Volume:\s*([\d.]+)/);
    const vol = match ? Math.round(parseFloat(match[1]) * 100) : 0;
    const muted = out.includes("[MUTED]");
    return { vol, muted };
  } catch {
    return { vol: 0, muted: false };
  }
}

const volumeCommand: Command = {
  id: "volume",
  name: "Volume",
  icon: "󰕾",
  description: "Adjust speaker and microphone volume",
  getItems(query: string): SubItem[] {
    const { vol, muted } = getCurrentVolume();
    const { vol: micVol, muted: micMuted } = getMicVolume();

    const items: SubItem[] = [
      {
        id: "vol-up",
        label: `Volume +5%  (now ${vol}%)`,
        icon: "󰕾",
        description: muted ? "MUTED" : "",
        action: () => execAsync("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+").catch(() => {}),
      },
      {
        id: "vol-down",
        label: `Volume -5%  (now ${vol}%)`,
        icon: "󰖀",
        description: muted ? "MUTED" : "",
        action: () => execAsync("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-").catch(() => {}),
      },
      {
        id: "vol-mute",
        label: muted ? "Unmute Speaker" : "Mute Speaker",
        icon: muted ? "󰕾" : "󰝟",
        action: () => execAsync("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle").catch(() => {}),
      },
      {
        id: "mic-up",
        label: `Mic +5%  (now ${micVol}%)`,
        icon: "󰍬",
        description: micMuted ? "MUTED" : "",
        action: () => execAsync("wpctl set-volume @DEFAULT_AUDIO_SOURCE@ 5%+").catch(() => {}),
      },
      {
        id: "mic-down",
        label: `Mic -5%  (now ${micVol}%)`,
        icon: "󰍭",
        description: micMuted ? "MUTED" : "",
        action: () => execAsync("wpctl set-volume @DEFAULT_AUDIO_SOURCE@ 5%-").catch(() => {}),
      },
      {
        id: "mic-mute",
        label: micMuted ? "Unmute Mic" : "Mute Mic",
        icon: micMuted ? "󰍬" : "󰍭",
        action: () => execAsync("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle").catch(() => {}),
      },
    ];

    if (!query) return items;
    return items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
  },
};

export default volumeCommand;
