import { exec, execAsync } from "ags/process";
import GLib from "gi://GLib";
import { Command, SubItem } from "./registry";

function getXdgDirs(): string[] {
  const keys = [
    GLib.UserDirectory.DIRECTORY_DOCUMENTS,
    GLib.UserDirectory.DIRECTORY_MUSIC,
    GLib.UserDirectory.DIRECTORY_PICTURES,
    GLib.UserDirectory.DIRECTORY_VIDEOS,
    GLib.UserDirectory.DIRECTORY_DESKTOP,
  ];
  return keys.map((k) => GLib.get_user_special_dir(k)).filter(Boolean) as string[];
}

function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function detectTerminal(): string {
  const candidates = ["kitty", "foot", "alacritty", "wezterm", "gnome-terminal", "xterm", "ghostty"];
  for (const term of candidates) {
    try {
      exec(`which ${term}`);
      return term;
    } catch {
      // not found
    }
  }
  return "xterm";
}

const directoriesCommand: Command = {
  id: "directories",
  name: "Directories",
  icon: "󰉋",
  description: "Open a directory in terminal",
  async getItems(query: string): Promise<SubItem[]> {
    const xdg = getXdgDirs();
    let bookmarks: string[] = [];
    try {
      const raw = await execAsync(`cat ${GLib.get_home_dir()}/.config/gtk-3.0/bookmarks`);
      bookmarks = raw
        .split("\n")
        .filter((l) => l.startsWith("file://"))
        .map((l) => decodeURIComponent(l.split(" ")[0].replace("file://", "")));
    } catch { }

    const seen = new Set<string>();
    const all: string[] = [];
    for (const d of [...bookmarks, ...xdg]) {
      if (!seen.has(d)) {
        seen.add(d);
        all.push(d);
      }
    }

    const filtered = all.filter((d) => fuzzyMatch(query, d)).slice(0, 12);
    const terminal = detectTerminal();

    return filtered.map((dir) => ({
      id: dir,
      label: dir.split("/").pop() ?? dir,
      icon: "󰉋",
      description: dir,
      action: () => {
        execAsync(`${terminal} --working-directory "${dir}"`).catch(() => {
          execAsync(`${terminal} -d "${dir}"`).catch(() => { });
        });
      },
    }));
  },
};

export default directoriesCommand;
