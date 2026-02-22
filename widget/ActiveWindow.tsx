import { createPoll } from "ags/time";

export default function ActiveWindow() {
  const activeWindowTitle = createPoll("N/A", 1000, `bash -c "hyprctl activewindow -j | jq -r '.title'"`);
  return <label hexpand xalign={0} label={activeWindowTitle} />
}
