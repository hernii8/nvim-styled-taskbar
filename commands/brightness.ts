import { exec, execAsync } from "ags/process";
import { Command, SubItem } from "./registry";

function getCurrentBrightness(): number {
  try {
    const cur = parseInt(exec("brightnessctl get")) || 0;
    const max = parseInt(exec("brightnessctl max")) || 100;
    return Math.round((cur / max) * 100);
  } catch {
    return 0;
  }
}

const brightnessCommand: Command = {
  id: "brightness",
  name: "Brightness",
  icon: "󰃞",
  description: "Adjust screen brightness",
  getItems(query: string): SubItem[] {
    const cur = getCurrentBrightness();

    const items: SubItem[] = [
      {
        id: "br-up",
        label: `Brightness +10%  (now ${cur}%)`,
        icon: "󰃠",
        action: () => execAsync("brightnessctl set 10%+").catch(() => {}),
      },
      {
        id: "br-down",
        label: `Brightness -10%  (now ${cur}%)`,
        icon: "󰃞",
        action: () => execAsync("brightnessctl set 10%-").catch(() => {}),
      },
      {
        id: "br-25",
        label: "Set Brightness 25%",
        icon: "󰃞",
        action: () => execAsync("brightnessctl set 25%").catch(() => {}),
      },
      {
        id: "br-50",
        label: "Set Brightness 50%",
        icon: "󰃟",
        action: () => execAsync("brightnessctl set 50%").catch(() => {}),
      },
      {
        id: "br-75",
        label: "Set Brightness 75%",
        icon: "󰃠",
        action: () => execAsync("brightnessctl set 75%").catch(() => {}),
      },
      {
        id: "br-100",
        label: "Set Brightness 100%",
        icon: "󰃠",
        action: () => execAsync("brightnessctl set 100%").catch(() => {}),
      },
    ];

    if (!query) return items;
    return items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
  },
};

export default brightnessCommand;
