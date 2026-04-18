import { exec, execAsync } from "ags/process";
import GLib from "gi://GLib";
import { Command, SubItem } from "./registry";

function parseXdgBookmarks(): string[] {
  try {
    const home = GLib.get_home_dir();
    const raw = exec(`cat ${home}/.config/gtk-3.0/bookmarks`);
    return raw
      .split("\n")
      .filter((line) => line.startsWith("file://"))
      .map((line) => {
        const url = line.split(" ")[0];
        return decodeURIComponent(url.replace("file://", ""));
      });
  } catch {
    return [];
  }
}

function findRecentDirs(): string[] {
  try {
    const home = GLib.get_home_dir();
    // Find directories up to depth 3, sorted by modification time
    const out = exec(
      `find ${home} -maxdepth 3 -type d -not -path '*/.*' 2>/dev/null | head -100`
    );
    return out.split("\n").filter(Boolean);
  } catch {
    return [];
  }
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
  const candidates = ["kitty", "foot", "alacritty", "wezterm", "gnome-terminal", "xterm"];
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
  getItems(query: string): SubItem[] {
    const bookmarks = parseXdgBookmarks();
    const recent = findRecentDirs();

    // Merge, bookmarks first, dedup
    const seen = new Set<string>();
    const all: string[] = [];
    for (const d of [...bookmarks, ...recent]) {
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
          // fallback for terminals that use -d instead
          execAsync(`${terminal} -d "${dir}"`).catch(() => {});
        });
      },
    }));
  },
};

export default directoriesCommand;
